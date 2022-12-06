import { Router } from 'express';

import userRouter from './routes/main.routes';
import { ROUTES } from './constants';

class AppRouter {
  private router = Router();

  constructor() {
    this.router.use(ROUTES.AUTH, userRouter);
  }

  getRouter() {
    return this.router;
  }
}

export default new AppRouter().getRouter();
