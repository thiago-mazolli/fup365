import { Router } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerFile from '../swagger_documentation.json';

const routes = Router();

routes.use(
  '/docs',
  swaggerUI.serve as any,
  swaggerUI.setup(swaggerFile) as any
);

export default routes;
