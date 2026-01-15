import { Request, Response, NextFunction } from 'express';

import Logs from '../models/Logs';
import AppError from '../helpers/AppError';

const gravaLogErros = async (
  err: any,
  _: Request,
  __: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    await Logs.gravaLog({
      ...err,
      error: err.message,
    });
  }

  return next(err);
};

export default gravaLogErros;
