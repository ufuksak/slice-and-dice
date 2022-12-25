import { Router } from 'express';
import MainController from '../controller/main.controller';
import Auth from '../middleware/auth';

class MainRouter {
  private router = Router();

  constructor() {
    this.router.post('/register', MainController.postSaveUser);
    this.router.delete('/register', MainController.delete);
    this.router.post('/login', Auth.authenticate('local', { session: false }), MainController.postLogin);
    this.router.post('/logout', MainController.postLogout);
    this.router.post('/forgotPassword', MainController.postForgotPassword);
    this.router.put('/update', Auth.authenticate('jwt', { session: false }), MainController.updateUser);
    this.router.get('/statistics', MainController.getStatistics);
    this.router.get('/users', Auth.authenticate('jwt', { session: false }), MainController.getUsers);
    this.router.post('/vehicle', Auth.authenticate('jwt', { session: false }), MainController.postVehicle);
    this.router.get('/vehicle', Auth.authenticate('jwt', { session: false }), MainController.getVehicles);
    this.router.get('/ping', Auth.authenticate('jwt', { session: false }), MainController.ping);
    this.router.get('/time', Auth.authenticate('jwt', { session: false }), MainController.getTime);
    this.router.post(
      '/setChargingProfile',
      Auth.authenticate('jwt', { session: false }),
      MainController.setChargingProfile,
    );
    this.router.post('/setRate', Auth.authenticate('jwt', { session: false }), MainController.setRate);
    this.router.post('/setConnector', Auth.authenticate('jwt', { session: false }), MainController.setConnector);
    this.router.post('/chargeStation', Auth.authenticate('jwt', { session: false }), MainController.setChargeStation);
    this.router.get('/chargeStation', Auth.authenticate('jwt', { session: false }), MainController.getChargeStation);
    this.router.post(
      '/startTransaction',
      Auth.authenticate('jwt', { session: false }),
      MainController.startTransaction,
    );
    this.router.post('/stopTransaction', Auth.authenticate('jwt', { session: false }), MainController.stopTransaction);
    this.router.post('/reserveNow', Auth.authenticate('jwt', { session: false }), MainController.reservationNow);
    this.router.post(
      '/cancelReservation',
      Auth.authenticate('jwt', { session: false }),
      MainController.cancelReservation,
    );
    this.router.post('/listReservation', Auth.authenticate('jwt', { session: false }), MainController.listReservation);
    this.router.post('/applicationForm', Auth.authenticate('jwt', { session: false }), MainController.applicationForm);
    this.router.post('/meterValues', Auth.authenticate('jwt', { session: false }), MainController.meterValues);
  }

  getRouter() {
    return this.router;
  }
}

export default new MainRouter().getRouter();
