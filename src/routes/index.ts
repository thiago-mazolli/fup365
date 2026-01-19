import { Router } from 'express';
import IntegracaoController from '../controllers/IntegracaoController';

const privateRoutes = Router();

privateRoutes.get('/', (_, res) => {
  return res.status(200).send({ mensagem: 'API em Execução' });
});

privateRoutes.post('/envia-pedidos', IntegracaoController.postOrdersItems);
privateRoutes.post(
  '/envia-cancelados',
  IntegracaoController.postOrdersCanceled
);
privateRoutes.post(
  '/envia-recebimentos',
  IntegracaoController.postOrdersReceived
);

export default privateRoutes;
