import { Request, Response } from 'express';

import apiFup365 from '../services/apiFup365';
import Integracao from '../models/Integracao';
import AppError from '../helpers/AppError';

export default class IntegracaoController {
  private static async integraDados(evento: 'I' | 'R' | 'C', pedidos: any[]) {
    for (let i = 0; i < pedidos.length; i++) {
      const { tblMega, pkMega, pedido } = pedidos[i];

      const canIntegrate = await Integracao.validaEnvio(tblMega, pkMega);

      if (canIntegrate) {
        try {
          const path =
            evento === 'I'
              ? '/api/postOrdersItems'
              : evento === 'R'
              ? '/api/postOrdersReceived'
              : '/api/postOrdersCanceled';

          const resp = await apiFup365.post(`${path}`, {
            ...pedido,
          });

          const { data, status, statusText, request } = resp;

          if (status === 200) {
            await Integracao.updateDataEnvio(tblMega, pkMega);

            await Integracao.gravaLogEnvio(
              tblMega,
              pkMega,
              'I',
              'Integracaoação enviada com sucesso'
            );
          } else {
            await Integracao.gravaLogEnvio(
              tblMega,
              pkMega,
              'E',
              `Erro: ${status} - ${statusText}`,
              JSON.stringify(request || {}),
              JSON.stringify(data || {})
            );
          }
        } catch (error) {
          if ((error as any).code === 'ERR_BAD_RESPONSE') {
            throw new AppError({
              statusCode: 500,
              header: 'Erro de Comunicação do Webhook',
              error: {
                message: 'A API de Comunicação do Webhook não esta respondendo',
              },
            });
          }

          await Integracao.gravaLogEnvio(
            tblMega,
            pkMega,
            'E',
            'Falha na comunicação com o webhook',
            JSON.stringify((error as any).config || {}),
            JSON.stringify({
              message: `${(error as any).code || ''} - ${(error as any)
                .message || ''}`,
            })
          );
        }
      }
    }

    return { message: 'Metodo Executado' };
  }

  static async postOrdersItems(_: Request, res: Response) {
    const pedidos = await Integracao.buscaIntegracaoPendente();

    const resp = await IntegracaoController.integraDados('I', pedidos);

    return res.status(200).send(resp);
  }

  static async postOrdersReceived(_: Request, res: Response) {
    const pedidos = await Integracao.buscaIntegracaoPendente();

    const resp = await IntegracaoController.integraDados('R', pedidos);

    return res.status(200).send(resp);
  }

  static async postOrdersCanceled(_: Request, res: Response) {
    const pedidos = await Integracao.buscaIntegracaoPendente();

    const resp = await IntegracaoController.integraDados('C', pedidos);

    return res.status(200).send(resp);
  }
}
