import { NextFunction, Response, Request } from 'express';

type Callback = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const forwardError =
  (callback: Callback) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await callback(req, res, next);
    } catch (error) {
      next(error);
    }
  };
