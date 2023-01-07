import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { forwardError } from '../forward-error';
import { initLogger, Logger } from '../helpers/logger';
import { AppDataSource } from '../orm';
import { User } from '../orm/entity/user';
import { deriveResetToken, deriveTokens, hashWithMD5, ITokens, verifyRefreshToken } from '../providers/encryption';
import { MainServices } from '../services/main.services';
import { userHasPrivilege } from '../orm/entity/privilege';
import ApiError, { UserDuplicated } from '../helpers/APIError';
import { components, operations } from '../types/schema';

type GeneralResponse = components['schemas']['response'];
type ServerTimeResponse = components['schemas']['ServerTime'];
type SetChargingProfile = components['schemas']['SetChargingProfile'];
type SetChargingProfileResponse = components['schemas']['SetChargingProfileResponse'];
type RateObject = components['schemas']['RateObject'];
type ConnectorItem = components['schemas']['Connector'];
type ChargeStationItem = components['schemas']['ChargeStation'];
type ResponseItem = components['schemas']['response'];
type Vehicle = components['schemas']['Vehicle'];
type StartTransactionRequest = components['schemas']['StartTransactionRequest'];
type StartTransactionResponse = components['schemas']['StartTransactionResponse'];
type StopTransactionRequest = components['schemas']['StopTransactionRequest'];
type StopTransactionResponse = components['schemas']['StopTransactionResponse'];
type ReserveNowRequest = components['schemas']['ReserveNowRequest'];
type ReserveNowResponse = components['schemas']['ReserveNowResponse'];
type CancelReservationRequest = components['schemas']['CancelReservation'];
type CancelReservationResponse = components['schemas']['CancelReservationResponse'];
type ReservationListRequest = components['schemas']['ReservationList'];
type ReservationListResponse = components['schemas']['ReservationListResponse'];
type ApplicationFormRequest = components['schemas']['ApplicationForm'];
type MeterValuesRequest = components['schemas']['MeterValuesRequest'];
type EncodeQrCode = components['schemas']['EncodeQrCode'];

type ChargePointParameters = operations['ChargePointList']['parameters'];

class MainController {
  public logger: Logger;

  private service: MainServices;

  constructor() {
    this.logger = initLogger('GitRepoController');
    this.service = new MainServices();
  }

  login = async (user: any, res: Response) => {
    const { accessToken, refreshToken }: ITokens = deriveTokens(user);
    res.status(httpStatus.CREATED).send({ accessToken, refreshToken });
  };

  logout = async (user: any, res: Response) => {
    // delete refreshToken from redis
    res.status(204).json({ message: 'goodbye!' });
  };

  postLogin: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as User;
      await this.login(user, res);
    } catch (e: any) {
      this.logger.error(e.message);
      res.status(403).json({ error: e.message });
    }
  });

  postLogout: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      // if there's no token, return 401
      if (!refreshToken) {
        res.status(401).send({ message: 'missing params' });
      }
      // verify signature
      const verified: any = verifyRefreshToken(refreshToken);
      const { user } = verified;
      // logout user
      await this.logout(user, res);
    } catch (e: any) {
      this.logger.error(e.message);
      res.status(403).send({ error: e.message });
    }
  });

  postForgotPassword = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ error: 'invalid params' });
      }
      // find a user account
      const user = await AppDataSource.getRepository(User).findOneBy({ name: name });
      if (!user) {
        res.status(404).json({ error: 'invalid params' });
      }
      const resetToken = deriveResetToken({ name });
      const hash = hashWithMD5(name);
      await this.service.emailPasswordResetLink(name, hash, resetToken);
      const response: GeneralResponse = {
        code: 200,
        message: `An email with a password reset link was sent to ${name}`,
      };
      res.status(200).json(response);
    } catch (e: any) {
      this.logger.error(e.message);
      res.status(500).json({ error: e.message });
    }
  });

  postSaveUser: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, password } = req.body[0];
      if (!name || !password) {
        res.status(400).send({ message: 'invalid params' });
      }
      const userWithPrivileges = [];
      for (const requestObject of req.body) {
        userWithPrivileges.push(await this.service.postSaveUser(requestObject));
      }
      await this.login(userWithPrivileges[0], res);
    } catch (e: any) {
      if (e instanceof UserDuplicated) {
        const apiErrorItem = e as UserDuplicated;
        throw new ApiError(apiErrorItem.message, apiErrorItem);
      } else {
        console.error(e.message);
        res.status(500).send({ error: e.message });
      }
    }
  });

  getUsers: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as User;
      if (!userHasPrivilege(user, { entity: User.name, action: 'admin', value: true })) {
        res.status(403).json({ message: 'You have no power here!' });
      }
      res.status(200).send(await this.service.getUsers());
    } catch (e) {
      console.error(e);
    }
  });

  getVehicles: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as User;
      if (!userHasPrivilege(user, { entity: User.name, action: 'admin', value: true })) {
        res.status(403).json({ message: 'You have no power here!' });
      }
      res.status(200).send(await this.service.getVehicles());
    } catch (e) {
      console.error(e);
    }
  });

  getStatistics: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      let response;
      if (req.query.contract) {
        response = await this.service.getStatisticsByOnContract();
      } else if (req.query.department) {
        response = await this.service.getStatisticsByDepartment();
      } else if (req.query.subDepartment) {
        response = await this.service.getStatisticsByDepartmentAndSubDepartment();
      } else {
        response = await this.service.getStatistics();
      }

      res.status(200).json(response);
    } catch (e: any) {
      console.error(e.message);
      res.status(500).send({ error: e.message });
    }
  });

  updateUser: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as User;
      const { displayName, firstName, lastName, bio, avatar, phone, country } = req.body;
      const newData = {
        displayName,
        firstName,
        lastName,
        bio,
        avatar,
        phone,
        country,
      };
      const repo = AppDataSource.getRepository(User);
      await repo.update(user.id, newData);
      const current = await repo.findOneBy({ id: user.id });
      res.status(200).send({ profile: { ...current, password: null } });
    } catch (e: any) {
      console.error(e.message);
      res.status(500).send({ error: e.message });
    }
  });

  delete: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      const user = await this.service.deleteUser(name);
      res.status(204).json({ user });
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  ping: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const response: GeneralResponse = {
        code: 200,
        message: 'the server is up',
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  getTime: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const response: ServerTimeResponse = {
        serverTime: Date.now(),
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  setChargingProfile: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: SetChargingProfile = req.body;
      await this.service.setChargingProfile(payload.csChargingProfiles);
      const response: SetChargingProfileResponse = {
        status: 'Accepted',
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  postVehicle: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: Vehicle = req.body;
      const vehicleObject = await this.service.setVehicle(payload);
      const response: ResponseItem = {
        code: 201,
        message: `Vehicle Created. Id; ${vehicleObject.id}`,
      };
      res.status(201).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  setRate: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: RateObject = req.body;
      await this.service.setRate(payload);
      const response: ResponseItem = {
        code: 200,
        message: 'Rate Object Created',
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  setConnector: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: ConnectorItem = req.body;
      await this.service.setConnector(payload);
      const response: ResponseItem = {
        code: 200,
        message: 'Connector Object Created',
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  setChargeStation: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: ChargeStationItem = req.body;
      await this.service.setChargeStation(payload);
      const response: ResponseItem = {
        code: 200,
        message: 'Charge Station Object Created',
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  getChargeStation: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const queryParams: ChargePointParameters['query'] = req.query;
      res
        .status(200)
        .json(await this.service.getChargeStation(queryParams.active, queryParams.model, queryParams.location));
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  startTransaction: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: StartTransactionRequest = req.body;
      const savedObject = await this.service.startTransaction(payload);
      const response: StartTransactionResponse = {
        idTagInfo: {
          expiryDate: Date.now().toString(),
          parentIdTag: '',
          status: 'Accepted',
        },
        transactionId: savedObject.id,
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  stopTransaction: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: StopTransactionRequest = req.body;
      await this.service.stopTransaction(payload);
      const response: StopTransactionResponse = {
        idTagInfo: {
          expiryDate: Date.now().toString(),
          parentIdTag: '',
          status: 'Accepted',
        },
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  reservationNow: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: ReserveNowRequest = req.body;
      await this.service.reservationNow(payload);
      const response: ReserveNowResponse = {
        status: 'Accepted',
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  cancelReservation: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: CancelReservationRequest = req.body;
      await this.service.cancelReservation(payload);
      const response: CancelReservationResponse = {
        status: 'Accepted',
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  listReservation: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: ReservationListRequest = req.body;
      const responseList = await this.service.listReservation(payload);
      const reservationResponseList: ReservationListResponse[] = [];
      responseList.forEach((reservation: any) => {
        let expiryTime = Number(reservation.expiryDate.toString() + '000');
        reservationResponseList.push({
          id: reservation.id,
          idTag: reservation.idTag,
          identity: reservation.id,
          serialNumber: reservation.id,
          connectorId: reservation.connectorId,
          expiryDate: reservation.expiryDate ? new Date(expiryTime).toISOString() : '',
          dateStart: reservation.expiryDate ? new Date(expiryTime).toISOString() : '',
          dateStop: reservation.expiryDate ? new Date(expiryTime).toISOString() : '',
        } as unknown as ReservationListResponse);
      });
      res.status(200).json(reservationResponseList);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  applicationForm: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: ApplicationFormRequest = req.body;
      await this.service.applicationForm(payload);
      const response: ResponseItem = {
        code: '200',
        message: 'Application Form Is Accepted',
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  meterValues: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: MeterValuesRequest = req.body;
      await this.service.meterValues(payload);
      const response: ResponseItem = {
        code: '200',
        message: 'Meter Value Recorded',
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });

  encodeQrCode: RequestHandler = forwardError(async (req: Request, res: Response): Promise<void> => {
    try {
      const payload: EncodeQrCode = req.body;
      await this.service.encodeQrCode(payload);
      const response: ResponseItem = {
        code: '200',
        message: 'The code Is created',
      };
      res.status(200).json(response);
    } catch (e: any) {
      res.status(500).json({ e });
      console.error(e.message);
    }
  });
}

export default new MainController();
