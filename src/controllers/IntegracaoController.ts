import { Request, Response } from 'express';
import { consoleLog } from 'dev4-code-library';
import { Axios } from 'axios';
import apiConector from '../services/apiConector';
import apiME from '../services/apiME';
import { formatResponse } from '../helpers/formatResponse';
import Integracao from '../models/Integracao';
import Usuario from '../models/Usuario';
import Agente from '../models/Agente';
import Produto from '../models/Produto';

export default class IntegracaoController {
  static async integraDados(req: Request, res: Response) {
    const { clientid } = req.headers;

    consoleLog('clientid', clientid);

    // BUSCA AS INTEGRAÇÕES PENDENTES
    const integracoes = await Integracao.buscaIntegracaoPendente(
      apiConector(1, clientid as string)
    );

    consoleLog('integracoes', integracoes);

    for (let i = 0; i < integracoes.length; i++) {
      const {
        tblMega,
        pkMega,
        metodo,
        host,
        path,
        authHost,
        authMetodo,
        authKey,
        authPath,
        idMe,
      } = integracoes[i];

      const canIntegrate = await Integracao.validaEnvio(
        apiConector(1, clientid as string),
        tblMega,
        pkMega
      );
      consoleLog('canIntegrate', canIntegrate);

      if (canIntegrate) {
        let body: any;

        try {
          consoleLog('tblMega/pkMega', `${tblMega}/${pkMega}`);

          switch (tblMega) {
            case 'GLO_GRUPO_USUARIO': {
              body = await Usuario.buscaDadosUsuario(
                apiConector(1, clientid as string),
                pkMega
              );
              break;
            }
            case 'GLO_AGENTES': {
              body = await Agente.buscaDadosAgente(
                apiConector(1, clientid as string),
                pkMega
              );
              break;
            }
            case 'EST_PRODUTOS': {
              body = await Produto.buscaDadosProduto(
                apiConector(1, clientid as string),
                pkMega
              );
              break;
            }
            default: {
              body = {};
              break;
            }
          }

          consoleLog('Enviando para o ME');
          consoleLog('body', body);

          const pathFinal = metodo === 'put' ? `${path}/${idMe}` : `${path}`;

          consoleLog('metodo', metodo);
          consoleLog('pathFinal', pathFinal);

          const respME = await apiME(
            host,
            authHost,
            authMetodo,
            authPath,
            authKey
          )[metodo as keyof typeof Axios](
            `${pathFinal}`,
            {},
            {
              headers: {
                'X-ME-CORRELATION-ID': pkMega,
              },
            }
          );

          consoleLog('respME', respME);

          const response = formatResponse(respME);

          consoleLog('formatResponse(respME)', response);

          let correlationId: string;

          switch (tblMega) {
            case 'GLO_GRUPO_USUARIO': {
              correlationId = response.data.correlationId;
              break;
            }
            case 'GLO_AGENTES': {
              correlationId = response.data.correlationId;
              break;
            }
            case 'EST_PRODUTOS': {
              correlationId = response.data.correlationId;
              break;
            }
            default: {
              correlationId = '';
              break;
            }
          }

          await Integracao.updateDataEnvio(
            apiConector(1, clientid as string),
            tblMega,
            pkMega,
            correlationId
          );

          await Integracao.gravaLogEnvio(
            apiConector(1, clientid as string),
            tblMega,
            pkMega,
            'I',
            'Integração realizada com sucesso',
            JSON.stringify(body, null, 2),
            JSON.stringify(response || {}, null, 2)
          );
        } catch (error) {
          const { response } = error;
          if (response.status === 500) {
            consoleLog('IntegracaoController catch (error)', error);

            await Integracao.gravaLogEnvio(
              apiConector(1, clientid as string),
              tblMega,
              pkMega,
              'E',
              'Falha na comunicação com o mercado eletrônico',
              JSON.stringify(error.config || {}, null, 2),
              JSON.stringify(
                {
                  message: `${error.code || ''} - ${error.message || ''}`,
                },
                null,
                2
              )
            );
          } else {
            const errors = response.data.errors as Record<string, string[]>;

            const mensagem = `${response.data.title}\n${Object.entries(errors)
              .map(([field, mensagens]) =>
                mensagens
                  .map((msg, i) => {
                    const texto = msg.replace(/'/g, '');
                    const labelErro =
                      mensagens.length > 1 ? ` (erro ${i + 1})` : '';
                    return `${field}: ${texto}${labelErro}`;
                  })
                  .join('\n')
              )
              .join('\n')}`;

            await Integracao.gravaLogEnvio(
              apiConector(1, clientid as string),
              tblMega,
              pkMega,
              'E',
              mensagem,
              JSON.stringify(body, null, 2),
              JSON.stringify(response || {}, null, 2)
            );
          }
        }
      }
    }

    consoleLog('Fim');

    return res.status(200).send();
    // return { message: 'Metodo Executado' };
  }
}
