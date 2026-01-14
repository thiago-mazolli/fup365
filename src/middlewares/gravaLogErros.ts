import { Request, Response, NextFunction } from 'express';
import { AppError } from 'dev4-code-library';
import { RequestSession } from 'dev4-node-library';
import Logs from '../models/Logs';

const gravaLogErros = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as RequestSession).session && err instanceof AppError) {
    const { usercode, clientid } = (req as RequestSession).session;

    await Logs.gravaLog(usercode || 1, clientid as string, {
      ...err,
      error: err.message,
    });
  }

  return next(err);
};

export default gravaLogErros;
