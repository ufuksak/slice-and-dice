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
    this.router.put('/update', Auth.authenticate('jwt', { session: false }), MainController.updateUser);
    this.router.get('/statistics', MainController.getStatistics);
    this.router.get('/users', Auth.authenticate('jwt', { session: false }), MainController.getUsers);
  }

  getRouter() {
    return this.router;
  }
}

export default new GitRepoRouter().getRouter();
