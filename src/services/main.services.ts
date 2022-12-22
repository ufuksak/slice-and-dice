import { GLOBAL } from '../constants';
import { initLogger, Logger } from '../helpers/logger';
import { AppDataSource } from '../orm';
import { Address } from '../orm/entity/address';
import { ChargeStation } from '../orm/entity/chargeStation';
import { ChargingProfile } from '../orm/entity/chargingProfile';
import { Connector } from '../orm/entity/connector';
import { Department } from '../orm/entity/department';
import { Privilege } from '../orm/entity/privilege';
import { Rate } from '../orm/entity/rate';
import { Salary } from '../orm/entity/salary';
import { SampledValue } from '../orm/entity/sampledValue';
import { StopTransaction } from '../orm/entity/stopTransaction';
import { SubDepartment } from '../orm/entity/subdepartment';
import { TransactionData } from '../orm/entity/transactionData';
import { User } from '../orm/entity/user';
import { EmailProvider } from '../providers/email';
import { TestDataSource } from '../test/test.datasource';
import { components } from '../types/schema';
import { UserDuplicated } from '../helpers/APIError';
import { DataSource } from 'typeorm';
import { BootInfo } from '../orm/entity/bootInfo';
import { Vehicle } from '../orm/entity/vehicle';
import { StartTransaction } from '../orm/entity/startTransaction';
import { Reservation } from '../orm/entity/reservation';

type PrivilegeItem = components['schemas']['PrivilegeItem'];
type AddressItem = components['schemas']['AddressItem'];
type ChargingProfileItem = components['schemas']['ChargingProfile'];
type RateObject = components['schemas']['RateObject'];
type ConnectorItem = components['schemas']['Connector'];
type ChargeStationItem = components['schemas']['ChargeStation'];
type VehicleItem = components['schemas']['Vehicle'];
type StartTransactionRequest = components['schemas']['StartTransactionRequest'];
type StopTransactionRequest = components['schemas']['StopTransactionRequest'];

const isEnv = (environment: string): boolean => {
  return process.env.NODE_ENV === environment;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
interface payloadType {
  name: string;
  password: string;
  privileges: PrivilegeItem[];
  addresses: AddressItem[];
  salary: number;
  currency: string;
  department: string;
  sub_department: string;
  on_contract: boolean;
}

export class MainServices {
  public logger: Logger;

  private dbSource: DataSource;

  private emailSender: EmailProvider;

  constructor() {
    this.logger = initLogger(this.constructor.name);
    this.dbSource = isEnv(GLOBAL.ENV_TEST) ? TestDataSource : AppDataSource;
    this.emailSender = new EmailProvider();
  }

  public async postSaveUser(payload: payloadType) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, password, privileges, addresses, salary, currency, department, sub_department, on_contract } =
      payload;
    try {
      const user: User = new User();
      const address: Address = new Address();
      const departmentEntity: Department = new Department();
      const subDepartmentEntity: SubDepartment = new SubDepartment();
      const salaryEntity: Salary = new Salary();
      user.name = name;
      user.password = password;
      user.onContract = Boolean(on_contract);
      const departmentFound = await this.dbSource.getRepository(Department).findBy({ name: department });
      if (departmentFound.length === 0) {
        departmentEntity.name = department;
        await this.dbSource.getRepository(Department).insert(departmentEntity);
        user.department = departmentEntity;
      } else {
        user.department = departmentFound[0];
      }
      const subDepartmentFound = await this.dbSource
        .getRepository(SubDepartment)
        .findBy({ subDepartmentName: sub_department });
      if (subDepartmentFound.length === 0) {
        subDepartmentEntity.department = user.department;
        subDepartmentEntity.subDepartmentName = sub_department;
        await this.dbSource.getRepository(SubDepartment).insert(subDepartmentEntity);
        user.subDepartment = subDepartmentEntity;
      } else {
        user.subDepartment = subDepartmentFound[0];
      }
      salaryEntity.amount = salary;
      salaryEntity.currency = currency;
      salaryEntity.user = user;
      user.salary = [];
      user.salary.push(salaryEntity);
      if (addresses && addresses.length > 0) {
        const addressItem: AddressItem = addresses[0];
        address.city = addressItem.city;
        address.line1 = addressItem.line1;
      }
      user.addresses = [];
      user.addresses.push(address);

      const privilege = new Privilege();
      if (privileges && privileges.length > 0) {
        privilege.entity = privileges[0].entity;
        privilege.create = privileges[0].create;
        privilege.update = privileges[0].update;
        privilege.delete = privileges[0].delete;
        privilege.admin = privileges[0].admin;
      } else {
        privilege.entity = Address.name;
      }
      user.privileges = [];
      user.privileges.push(privilege);

      // create new user
      const newUser = await this.dbSource.getRepository(User).save(user);
      // get user with privileges
      return await this.dbSource.getRepository(User).findOne({ where: { id: newUser.id }, relations: ['privileges'] });
    } catch (e: any) {
      console.error(e.message);
      if (e.code === 'ER_DUP_ENTRY' || e.message.toString().includes('UNIQUE')) {
        throw new UserDuplicated(name, e);
      }
    }
  }

  public async emailPasswordResetLink(email: string, hash: string, resetToken: string) {
    await this.emailSender.emailPasswordResetLink(email, hash, resetToken);
  }

  public async deleteUser(name: string) {
    const user = await this.dbSource.getRepository(User).findOneBy({ name });
    if (user) {
      return this.dbSource.getRepository(User).delete({ name });
    } else {
      throw new Error(`No account exists with the email ${name} to delete.`);
    }
  }

  public async getVehicles() {
    try {
      return await AppDataSource.getRepository(Vehicle).find();
    } catch (e) {
      console.error(e);
    }
  }

  public async getUsers() {
    try {
      return await AppDataSource.getRepository(User).find({
        relations: ['privileges'],
      });
    } catch (e) {
      console.error(e);
    }
  }

  public async setVehicle(vehicle: VehicleItem) {
    return AppDataSource.getRepository(Vehicle).save(vehicle);
  }

  public async setChargingProfile(chargingProfile: ChargingProfileItem) {
    await AppDataSource.getRepository(ChargingProfile).save(chargingProfile);
  }

  public async setRate(rateObject: RateObject) {
    await AppDataSource.getRepository(Rate).save(rateObject);
  }

  public async setConnector(connector: ConnectorItem) {
    let rateObject: Rate = connector.rate as Rate;
    await AppDataSource.getRepository(Rate).save(rateObject);
    connector.rate = rateObject;
    await AppDataSource.getRepository(Connector).save(connector);
  }

  public async setChargeStation(chargeStationItem: ChargeStationItem) {
    let chargeStationObject: ChargeStation = chargeStationItem as ChargeStation;
    await AppDataSource.getRepository(ChargeStation).save(chargeStationObject);
    const bootInfo = chargeStationObject.bootInfo;
    bootInfo.chargeStation = chargeStationObject;
    await AppDataSource.getRepository(BootInfo).save(bootInfo);
    chargeStationObject.connectors.forEach((connector) => {
      let rateObject: Rate = connector.rate as Rate;
      AppDataSource.getRepository(Rate).save(rateObject);
      connector.rate = rateObject;
      connector.chargestationObject = chargeStationObject;
      AppDataSource.getRepository(Connector).save(connector);
    });
  }

  public async getChargeStation(active: boolean | undefined, model: string | undefined, location: string | undefined) {
    let response: ChargeStation[] = [];
    await AppDataSource.getRepository(ChargeStation)
      .findBy({ model, active, location })
      .then((stationResponse) => {
        this.logger.debug(stationResponse);
        response = stationResponse;
      });
    return response;
  }

  public async startTransaction(startTransactionRequest: StartTransactionRequest) {
    let reservationObject = await AppDataSource.getRepository(Reservation).findOneBy({
      id: startTransactionRequest.reservationId?.toString(),
    });
    if (reservationObject === null) {
      reservationObject = new Reservation();
    }
    let connectorObject = await AppDataSource.getRepository(Connector).findOneBy({
      id: startTransactionRequest.connectorId?.toString(),
    });
    if (connectorObject === null) {
      connectorObject = new Connector();
    }
    const startTransactionItem: StartTransaction = {
      connector: connectorObject,
      idTag: startTransactionRequest.idTag,
      meterStart: startTransactionRequest.meterStart,
      reservation: reservationObject,
      timestamp: startTransactionRequest.timestamp,
    } as StartTransaction;
    const newTransaction: StartTransaction = await AppDataSource.getRepository(StartTransaction).save(
      startTransactionItem,
    );
    return newTransaction;
  }

  public async stopTransaction(stopTransactionRequest: StopTransactionRequest) {
    stopTransactionRequest.transactionData?.forEach((transactionData) => {
      const transactionObject = new TransactionData();
      transactionObject.timestamp = transactionData.timestamp;
      transactionObject.sampledValue?.forEach((sampledValue) => {
        const sampledValueObject = new SampledValue();
        sampledValueObject.value = sampledValue.value;
        sampledValueObject.context = sampledValue.context;
        sampledValueObject.format = sampledValue.format;
        sampledValueObject.measurand = sampledValue.measurand;
        sampledValueObject.phase = sampledValue.phase;
        sampledValueObject.location = sampledValue.location;
        sampledValueObject.unit = sampledValue.unit;
        AppDataSource.getRepository(SampledValue).save(sampledValueObject);
      });
    });

    const stopTransactionItem: StopTransaction = {
      idTag: stopTransactionRequest.idTag,
      meterStop: stopTransactionRequest.meterStop,
      timestamp: stopTransactionRequest.timestamp,
      transactionId: stopTransactionRequest.transactionId,
      reason: stopTransactionRequest.reason,
      transactionData: stopTransactionRequest.transactionData,
    } as unknown as StopTransaction;
    const newStopTransaction = await AppDataSource.getRepository(StopTransaction).save(stopTransactionItem);
    newStopTransaction.transactionData?.forEach((transactionData) => {
      transactionData.stopTransaction = newStopTransaction;
      AppDataSource.getRepository(TransactionData).save(transactionData);
    });
  }

  public async getStatistics() {
    return this.dbSource
      .getRepository(Salary)
      .createQueryBuilder('salaries')
      .select('AVG(salaries.amount)', 'averageSalary')
      .addSelect('MIN(salaries.amount)', 'minSalary')
      .addSelect('MAX(salaries.amount)', 'maxSalary')
      .getRawOne();
  }

  public async getStatisticsByOnContract() {
    return this.dbSource
      .getRepository(Salary)
      .createQueryBuilder('salaries')
      .select('AVG(salaries.amount)', 'averageSalary')
      .addSelect('MIN(salaries.amount)', 'minSalary')
      .addSelect('MAX(salaries.amount)', 'maxSalary')
      .innerJoin('salaries.user', 'user', 'user.onContract = :contract', { contract: true })
      .getRawOne();
  }

  public async getStatisticsByDepartment() {
    return this.dbSource
      .getRepository(Salary)
      .createQueryBuilder('salaries')
      .select('department.name')
      .addSelect('AVG(salaries.amount)', 'averageSalary')
      .addSelect('MIN(salaries.amount)', 'minSalary')
      .addSelect('MAX(salaries.amount)', 'maxSalary')
      .innerJoin('salaries.user', 'user')
      .innerJoin('user.department', 'department')
      .groupBy('department.name')
      .getRawMany();
  }

  public async getStatisticsByDepartmentAndSubDepartment() {
    return this.dbSource
      .getRepository(Salary)
      .createQueryBuilder('salaries')
      .select('department.name')
      .addSelect('subDepartment.subDepartmentName')
      .addSelect('AVG(salaries.amount)', 'averageSalary')
      .addSelect('MIN(salaries.amount)', 'minSalary')
      .addSelect('MAX(salaries.amount)', 'maxSalary')
      .innerJoin('salaries.user', 'user')
      .innerJoin('user.department', 'department')
      .innerJoin('department.subDepartment', 'subDepartment')
      .groupBy('department.name')
      .addGroupBy('subDepartment.subDepartmentName')
      .getRawMany();
  }
}
