import { Router } from 'express';
import IntegracaoController from '../controllers/IntegracaoController';

const privateRoutes = Router();

privateRoutes.get('/', (_, res) => {
  return res.status(200).send({ mensagem: 'API em Execução' });
});

privateRoutes.get('/envia-pedidos', IntegracaoController.postOrdersItems);
privateRoutes.get('/envia-cancelados', IntegracaoController.postOrdersCanceled);
privateRoutes.get(
  '/envia-recebimentos',
  IntegracaoController.postOrdersReceived
);

export default privateRoutes;
