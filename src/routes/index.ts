import { Router } from 'express';
import IntegracaoController from '../controllers/IntegracaoController_old';
import NotificController from '../controllers/IntegracaoController';

const privateRoutes = Router();

privateRoutes.get('/', (req, res) => {
  return res.status(200).send({ mensagem: 'API em Execução' });
});

privateRoutes.put('/envia-dados', IntegracaoController.integraDados);
// privateRoutes.put('/envia-usuario', UsuarioController.integraUsuario);
// privateRoutes.put('/envia-agente', AgenteController.integraAgente);
// privateRoutes.put('/envia-produto', ProdutoController.integraProduto);

privateRoutes.put(
  '/webhook/notific-modific-pedidos',
  NotificController.modificPedido
);

export default privateRoutes;
