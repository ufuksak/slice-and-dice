import { Router } from 'express';
import MainController from '../controller/main.controller';
import Auth from '../middleware/auth';

class GitRepoRouter {
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
  }

  getRouter() {
    return this.router;
  }
}

export default new GitRepoRouter().getRouter();
