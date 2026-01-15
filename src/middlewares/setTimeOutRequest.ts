import { Request, Response, NextFunction } from 'express';

const setTimeOutRequest = (req: Request, res: Response, next: NextFunction) => {
  req.socket.setTimeout(0);
  return next();
};

export default setTimeOutRequest;
