import { Router } from 'express';
import { validaTokenSession } from 'dev4-node-library';
import validaProductKey from '../middlewares/validaProductKey';

import AgenteController from '../controllers/AgenteController';
import CotacaoController from '../controllers/CotacaoController';
import PedidoController from '../controllers/PedidoController';
import ProdutoController from '../controllers/ProdutoController';
import SolicitacaoController from '../controllers/SolicitacaoController';
import TokenController from '../controllers/TokenController';
import UsuarioController from '../controllers/UsuarioController';

const routes = Router();

// GERA TOKEN DE ACESSO
// get-token
routes.get(
  '/get-token',
  validaProductKey,
  TokenController.getToken
  /*
    #swagger.tags = ['Token']
    #swagger.description = 'Obtem o Token de autenticação da API'
    #swagger.parameters['productkey'] = {
      in: 'header',
      description: 'Chave da licença do cliente (Product Key)',
      required: true,
      type: 'string',
      value: '46bb6ce141-aa49ef2ff1-38216b80c8-19733b1f2e'
    }
    #swagger.responses[401] = {
      schema: { error: 'A Chave do Produto não foi fornecida!' }
    }
    #swagger.responses[500] = {
      schema: {
        "error": {
          "cod": 500,
          "header": "Erro Interno",
          "message": "Erro interno sem tratamento"
        }
      }
    }
  */
);

// MÉTODOS DE AGENTES
// agente-list
// routes.get(
//   '/agente-list',
//   validaProductKey,
//   validaTokenSession,
//   AgenteController.findAgente
//   /*
//     #swagger.tags = ['Clientes']
//     #swagger.description = 'Obtem a lista de Clientes'
//     #swagger.parameters['Authorization'] = {
//       in: 'header',
//       description: 'Bearer token de autenticação',
//       required: true,
//       type: 'string',
//       value: 'Bearer {token}'
//     }
//     #swagger.parameters['productkey'] = {
//       in: 'header',
//       description: 'Chave da licença do cliente (Product Key)',
//       required: true,
//       type: 'string',
//       value: '46bb6ce141-aa49ef2ff1-38216b80c8-19733b1f2e'
//     }
//     #swagger.responses[401] = {
//       schema: { error: 'A Chave do Produto não foi fornecida!' }
//     }
//     #swagger.responses[401] = {
//       schema: { error: 'Token inválido!' }
//     }
//     #swagger.responses[401] = {
//       schema: { error: 'O Token não foi fornecido!' }
//     }
//     #swagger.responses[500] = {
//       schema: {
//         "error": {
//           "cod": 500,
//           "header": "Erro Interno",
//           "message": "Erro interno sem tratamento"
//         }
//       }
//     }
//   */
// );

// solicitacoes
routes.get(
  '/solicitacoes',
  validaProductKey,
  validaTokenSession,
  SolicitacaoController.buscaSolicitacoes
  /*
    #swagger.tags = ['Solicitações']
    #swagger.description = 'Obtém a lista de Solicitações'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Bearer token de autenticação',
      required: true,
      type: 'string',
      value: 'Bearer {token}'
    }
    #swagger.parameters['productkey'] = {
      in: 'header',
      description: 'Chave da licença do cliente (Product Key)',
      required: true,
      type: 'string',
      value: '46bb6ce141-aa49ef2ff1-38216b80c8-19733b1f2e'
    }
    #swagger.parameters['dataInicial'] = {
      in: 'query',
      description: 'Data inicial para a pesquisa (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '01-11-2025'
    }
    #swagger.parameters['dataFinal'] = {
      in: 'query',
      description: 'Data final para a pesquisa (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '06-11-2025'
    }
    #swagger.parameters['codFilial'] = {
      in: 'query',
      description: 'Código da filial.',
      required: false,
      type: 'integer',
      example: 5
    }
    #swagger.parameters['codigoSolicitacao'] = {
      in: 'query',
      description: 'Código da solicitação.',
      required: false,
      type: 'integer',
      example: 12345
    }
    #swagger.parameters['numeroRM'] = {
      in: 'query',
      description: 'Numero da RM da Solicitação.',
      required: false,
      type: 'integer',
      example: 12345
    }
    #swagger.responses[401] = {
      schema: { error: 'A Chave do Produto não foi fornecida!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'Token inválido!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'O Token não foi fornecido!' }
    }
    #swagger.responses[500] = {
      schema: {
        "error": {
          "cod": 500,
          "header": "Erro Interno",
          "message": "Erro interno sem tratamento"
        }
      }
    }
  */
);

// produtos
routes.get(
  '/produtos',
  validaProductKey,
  validaTokenSession,
  ProdutoController.buscaProdutos
  /*
    #swagger.tags = ['Produtos']
    #swagger.description = 'Obtém a lista de produtos disponíveis no sistema.'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Bearer token de autenticação',
      required: true,
      type: 'string',
      value: 'Bearer {token}'
    }
    #swagger.parameters['productkey'] = {
      in: 'header',
      description: 'Chave da licença do cliente (Product Key)',
      required: true,
      type: 'string',
      value: '46bb6ce141-aa49ef2ff1-38216b80c8-19733b1f2e'
    }
    #swagger.parameters['dataInicial'] = {
      in: 'query',
      description: 'Data inicial para filtrar os produtos (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '01-11-2025'
    }
    #swagger.parameters['dataFinal'] = {
      in: 'query',
      description: 'Data final para filtrar os produtos (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '06-11-2025'
    }
    #swagger.parameters['codigoProduto'] = {
      in: 'query',
      description: 'Código do produto para busca específica.',
      required: false,
      type: 'integer',
      example: 123
    }
    #swagger.parameters['ativo'] = {
      in: 'query',
      description: 'Status do produto. Informe \"S\" para ativos, \"N\" para inativos, ou \"X\" para todos.',
      required: false,
      type: 'string',
      enum: ['S', 'N', 'X'],
      example: 'S'
    }
    #swagger.responses[401] = {
      schema: { error: 'A Chave do Produto não foi fornecida!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'Token inválido!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'O Token não foi fornecido!' }
    }
    #swagger.responses[500] = {
      schema: {
        "error": {
          "cod": 500,
          "header": "Erro Interno",
          "message": "Erro interno sem tratamento"
        }
      }
    }
  */
);

// fornecedores
routes.get(
  '/fornecedores',
  validaProductKey,
  validaTokenSession,
  AgenteController.buscaFornecedores
  /*
    #swagger.tags = ['Fornecedores']
    #swagger.description = 'Obtém a lista de fornecedores disponíveis no sistema.'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Bearer token de autenticação',
      required: true,
      type: 'string',
      value: 'Bearer {token}'
    }
    #swagger.parameters['productkey'] = {
      in: 'header',
      description: 'Chave da licença do cliente (Product Key)',
      required: true,
      type: 'string',
      value: '46bb6ce141-aa49ef2ff1-38216b80c8-19733b1f2e'
    }
    #swagger.parameters['dataInicial'] = {
      in: 'query',
      description: 'Data inicial para filtrar os fornecedores (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '01-11-2025'
    }
    #swagger.parameters['dataFinal'] = {
      in: 'query',
      description: 'Data final para filtrar os fornecedores (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '06-11-2025'
    }
    #swagger.responses[401] = {
      schema: { error: 'A Chave do Produto não foi fornecida!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'Token inválido!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'O Token não foi fornecido!' }
    }
    #swagger.responses[500] = {
      schema: {
        "error": {
          "cod": 500,
          "header": "Erro Interno",
          "message": "Erro interno sem tratamento"
        }
      }
    }
  */
);

// usuarios
routes.get(
  '/usuarios',
  validaProductKey,
  validaTokenSession,
  UsuarioController.buscaUsuarios
  /*
    #swagger.tags = ['Usuarios']
    #swagger.description = 'Obtém a lista de usuarios disponíveis no sistema.'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Bearer token de autenticação',
      required: true,
      type: 'string',
      value: 'Bearer {token}'
    }
    #swagger.parameters['productkey'] = {
      in: 'header',
      description: 'Chave da licença do cliente (Product Key)',
      required: true,
      type: 'string',
      value: '46bb6ce141-aa49ef2ff1-38216b80c8-19733b1f2e'
    }
    #swagger.parameters['dataInicial'] = {
      in: 'query',
      description: 'Data inicial para filtrar os usuarios (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '01-11-2025'
    }
    #swagger.parameters['dataFinal'] = {
      in: 'query',
      description: 'Data final para filtrar os usuarios (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '06-11-2025'
    }
    #swagger.parameters['codigoUsuario'] = {
      in: 'query',
      description: 'Código do usuario para busca específica.',
      required: false,
      type: 'integer',
      example: 123
    }
    #swagger.responses[401] = {
      schema: { error: 'A Chave do Usuario não foi fornecida!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'Token inválido!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'O Token não foi fornecido!' }
    }
    #swagger.responses[500] = {
      schema: {
        "error": {
          "cod": 500,
          "header": "Erro Interno",
          "message": "Erro interno sem tratamento"
        }
      }
    }
  */
);

// cotacao
routes.post(
  '/cotacao',
  validaProductKey,
  validaTokenSession,
  CotacaoController.geraCotacao
  /*
    #swagger.tags = ['Cotação']
    #swagger.description = 'Gera uma cotação a partir das informações enviadas, incluindo itens e suas solicitações vinculadas.'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Bearer token de autenticação',
      required: true,
      type: 'string',
      value: 'Bearer {token}'
    }
    #swagger.parameters['productkey'] = {
      in: 'header',
      description: 'Chave da licença do cliente (Product Key)',
      required: true,
      type: 'string',
      value: '46bb6ce141-aa49ef2ff1-38216b80c8-19733b1f2e'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados da Cotação',
      required: true,
      schema: {
        type: 'object',
        required: ['filial', 'codigoCotacao', 'fornecedor', 'valorTotal', 'itens'],
        properties: {
          filial: {
            type: 'integer',
            example: 1,
            description: 'Código da filial vinculada à cotação'
          },
          codigoCotacao: {
            type: 'string',
            example: 'COT12345',
            description: 'Identificador único da cotação'
          },
          fornecedor: {
            type: 'integer',
            example: 501,
            description: 'Código do fornecedor da cotação'
          },
          valorTotal: {
            type: 'number',
            example: 15000.75,
            description: 'Valor total da cotação'
          },
          itens: {
            type: 'array',
            description: 'Lista de itens incluídos na cotação',
            items: {
              type: 'object',
              required: ['codigoProduto', 'quantidade', 'valorUnitario', 'solicitacao'],
              properties: {
                codigoProduto: {
                  type: 'integer',
                  example: 1234,
                  description: 'Código do produto'
                },
                quantidade: {
                  type: 'number',
                  example: 10,
                  description: 'Quantidade cotada do produto'
                },
                valorUnitario: {
                  type: 'number',
                  example: 150.75,
                  description: 'Valor unitário do item'
                },
                solicitacao: {
                  type: 'array',
                  description: 'Solicitações vinculadas a este item',
                  items: {
                    type: 'object',
                    required: ['codigoSolicitacao', 'seqItemSoli'],
                    properties: {
                      codigoSolicitacao: {
                        type: 'integer',
                        example: 1001,
                        description: 'Código da solicitação vinculada'
                      },
                      seqItemSoli: {
                        type: 'integer',
                        example: 1,
                        description: 'Sequência do item dentro da solicitação'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Cotação gerada com sucesso',
      schema: {
        message: 'Cotação gerada com sucesso'
      }
    }
    #swagger.responses[401] = {
      schema: { error: 'Token inválido!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'O Token não foi fornecido!' }
    }
    #swagger.responses[500] = {
      schema: {
        "error": {
          "cod": 500,
          "header": "Erro Interno",
          "message": "Erro interno sem tratamento"
        }
      }
    }
  */
);

// pedido
routes.delete(
  '/cancelaPedido/:codigoPedido',
  validaProductKey,
  validaTokenSession,
  PedidoController.cancelaPedido
  /*
    #swagger.tags = ['Pedido de Compras']
    #swagger.description = 'Cancela um pedido de compras a partir da chave do pedido.'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Bearer token de autenticação',
      required: true,
      type: 'string',
      value: 'Bearer {token}'
    }
    #swagger.parameters['productkey'] = {
      in: 'header',
      description: 'Chave da licença do cliente (Product Key)',
      required: true,
      type: 'string',
      value: '46bb6ce141-aa49ef2ff1-38216b80c8-19733b1f2e'
    }
    #swagger.parameters['codigoPedido'] = {
      in: 'params',
      description: 'Chave do Pedido de Compras',
      required: true,
      type: 'string',
      value: '53;1;3;G;111;1;11'
    }
    #swagger.responses[200] = {
      description: 'Pedido de Compras cancelado com sucesso',
      schema: {
        message: 'Pedido de Compras cancelado com sucesso'
      }
    }
    #swagger.responses[401] = {
      schema: { error: 'Token inválido!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'O Token não foi fornecido!' }
    }
    #swagger.responses[500] = {
      schema: {
        "error": {
          "cod": 500,
          "header": "Erro Interno",
          "message": "Erro interno sem tratamento"
        }
      }
    }
  */
);

routes.get(
  '/recebimentos',
  validaProductKey,
  validaTokenSession,
  PedidoController.buscaRecebimentos
  /*
    #swagger.tags = ['Pedido de Compras']
    #swagger.description = 'Obtém os Recebimentos por Pedido de Compras no sistema.'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Bearer token de autenticação',
      required: true,
      type: 'string',
      value: 'Bearer {token}'
    }
    #swagger.parameters['productkey'] = {
      in: 'header',
      description: 'Chave da licença do cliente (Product Key)',
      required: true,
      type: 'string',
      value: '46bb6ce141-aa49ef2ff1-38216b80c8-19733b1f2e'
    }
    #swagger.parameters['dataInicial'] = {
      in: 'query',
      description: 'Data inicial para filtrar os recebimentos (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '01-11-2025'
    }
    #swagger.parameters['dataFinal'] = {
      in: 'query',
      description: 'Data final para filtrar os recebimentos (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '06-11-2025'
    }
    #swagger.responses[401] = {
      schema: { error: 'A Chave do Produto não foi fornecida!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'Token inválido!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'O Token não foi fornecido!' }
    }
    #swagger.responses[500] = {
      schema: {
        "error": {
          "cod": 500,
          "header": "Erro Interno",
          "message": "Erro interno sem tratamento"
        }
      }
    }
  */
);

routes.get(
  '/contasPagar',
  validaProductKey,
  validaTokenSession,
  PedidoController.buscaContasPagar
  /*
    #swagger.tags = ['Pedido de Compras']
    #swagger.description = 'Obtém as Contas a Pagar por Pedido de Compras no sistema.'
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Bearer token de autenticação',
      required: true,
      type: 'string',
      value: 'Bearer {token}'
    }
    #swagger.parameters['productkey'] = {
      in: 'header',
      description: 'Chave da licença do cliente (Product Key)',
      required: true,
      type: 'string',
      value: '46bb6ce141-aa49ef2ff1-38216b80c8-19733b1f2e'
    }
    #swagger.parameters['dataInicial'] = {
      in: 'query',
      description: 'Data inicial para filtrar as Contas a Pagar (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '01-11-2025'
    }
    #swagger.parameters['dataFinal'] = {
      in: 'query',
      description: 'Data final para filtrar as Contas a Pagar (formato dd-mm-yyyy).',
      required: false,
      type: 'string',
      example: '06-11-2025'
    }
    #swagger.responses[401] = {
      schema: { error: 'A Chave do Produto não foi fornecida!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'Token inválido!' }
    }
    #swagger.responses[401] = {
      schema: { error: 'O Token não foi fornecido!' }
    }
    #swagger.responses[500] = {
      schema: {
        "error": {
          "cod": 500,
          "header": "Erro Interno",
          "message": "Erro interno sem tratamento"
        }
      }
    }
  */
);

export default routes;
