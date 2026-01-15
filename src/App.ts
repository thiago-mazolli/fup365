import 'express-async-errors';

import express, { Express } from 'express';
import cors from 'cors';

import privateRoutes from './routes';
import gravaLogErros from './middlewares/gravaLogErros';
import processListener from './middlewares/processListener';
import setTimeOutRequest from './middlewares/setTimeOutRequest';
import logErrors from './middlewares/logErrors';

class App {
  server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.errors();
  }

  middlewares() {
    this.server.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    });
    this.server.use(cors());
    this.server.use(express.json({ limit: '900mb' }));
    this.server.use(
      express.urlencoded({
        limit: '900mb',
        extended: true,
        parameterLimit: 100000,
      })
    );

    this.server.use(processListener);
    this.server.use(setTimeOutRequest);
  }

  routes() {
    this.server.use(privateRoutes);
  }

  errors() {
    this.server.use(gravaLogErros);
    this.server.use(logErrors);
  }
}

export default new App().server;
