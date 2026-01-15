import { Request, Response, NextFunction } from 'express';

// Essencial para execução do pool(ODB)
const processListener = (req: Request, res: Response, next: NextFunction) => {
  try {
    process.setMaxListeners(0);
    return next();
  } catch (error) {
    console.log('error:', error);
    return res.status(500).json({ error: 'setMaxListeners error' });
  }
};

export default processListener;
