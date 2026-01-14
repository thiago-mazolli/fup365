import { Router } from 'express';
import VersionController from '../controllers/VersionController';
// import AgenteController from '../controllers/AgenteController';
// import ProdutoController from '../controllers/ProdutoController';
// import UsuarioController from '../controllers/UsuarioController';
import IntegracaoController from '../controllers/IntegracaoController';
import NotificController from '../controllers/NotificController';

const privateRoutes = Router();
privateRoutes.put('/removeVersion', VersionController.removeVersion);
privateRoutes.put('/updateVersion', VersionController.updateVersion);

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

privateRoutes.put(
  '/webhook/notific-modific-contratos',
  NotificController.modificContrato
);

export default privateRoutes;
