import { Request, Response } from 'express';
import { Axios } from 'axios';

import apiME from '../services/apiME';
import { formatResponse } from '../helpers/formatResponse';
import Integracao from '../models/Integracao';

export default class IntegracaoController {
  static async integraDados(req: Request, res: Response) {
    const { clientid } = req.headers;

    console.log('clientid', clientid);

    // BUSCA AS INTEGRAÇÕES PENDENTES
    const integracoes = await Integracao.buscaIntegracaoPendente();

    console.log('integracoes', integracoes);

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

      const canIntegrate = await Integracao.validaEnvio(tblMega, pkMega);
      console.log('canIntegrate', canIntegrate);

      if (canIntegrate) {
        let body: any;

        try {
          console.log('tblMega/pkMega', `${tblMega}/${pkMega}`);

          switch (tblMega) {
            case 'GLO_GRUPO_USUARIO': {
              body = await Usuario.buscaDadosUsuario(pkMega);
              break;
            }
            case 'GLO_AGENTES': {
              body = await Agente.buscaDadosAgente(pkMega);
              break;
            }
            case 'EST_PRODUTOS': {
              body = await Produto.buscaDadosProduto(pkMega);
              break;
            }
            default: {
              body = {};
              break;
            }
          }

          console.log('Enviando para o ME');
          console.log('body', body);

          const pathFinal = metodo === 'put' ? `${path}/${idMe}` : `${path}`;

          console.log('metodo', metodo);
          console.log('pathFinal', pathFinal);

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

          console.log('respME', respME);

          const response = formatResponse(respME);

          console.log('formatResponse(respME)', response);

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

          await Integracao.updateDataEnvio(tblMega, pkMega, correlationId);

          await Integracao.gravaLogEnvio(
            tblMega,
            pkMega,
            'I',
            'Integração realizada com sucesso',
            JSON.stringify(body, null, 2),
            JSON.stringify(response || {}, null, 2)
          );
        } catch (error) {
          const { response } = error as any;
          if (response.status === 500) {
            console.log('IntegracaoController catch (error)', error);

            await Integracao.gravaLogEnvio(
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

    console.log('Fim');

    return res.status(200).send();
    // return { message: 'Metodo Executado' };
  }
}
