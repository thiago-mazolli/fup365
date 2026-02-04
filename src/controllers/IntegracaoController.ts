import { Request, Response } from 'express';

import apiFup365 from '../services/apiFup365';
import Integracao from '../models/Integracao';
import AppError from '../helpers/AppError';
import safeStringify from '../helpers/safeStringify';

export default class IntegracaoController {
  private static async integraDados(evento: 'I' | 'R' | 'C', registros: any[]) {
    console.log('integraDados');
    console.log('registros.length:', registros.length);

    for (let i = 0; i < registros.length; i++) {
      const { tblMega, pkMega, body } = registros[i];

      console.log('tblMega:', tblMega);
      console.log('pkMega:', pkMega);
      const canIntegrate = await Integracao.validaEnvio(tblMega, pkMega);
      console.log('canIntegrate:', canIntegrate);

      if (canIntegrate) {
        try {
          const path =
            evento === 'I'
              ? '/api/postOrdersItems'
              : evento === 'R'
              ? '/api/postOrdersReceived'
              : '/api/postOrdersCanceled';

          console.log('body:', safeStringify(body));

          const resp = await apiFup365.post(`${path}`, {
            ...body,
          });

          console.log('resp:', resp);

          const { data, status, statusText } = resp;

          if (data.status.toUpperCase() === 'SUCCESS') {
            await Integracao.updateDataEnvio(tblMega, pkMega);

            await Integracao.gravaLogEnvio(
              tblMega,
              pkMega,
              'I',
              'Integração enviada com sucesso',
              safeStringify(body || {}),
              safeStringify(data || {})
            );
          } else {
            await Integracao.gravaLogEnvio(
              tblMega,
              pkMega,
              'E',
              `Erro: ${status} - ${statusText}`,
              safeStringify(body || {}),
              safeStringify(data || {})
            );
          }
        } catch (error) {
          console.log('integraDados catch error:', error);

          await Integracao.gravaLogEnvio(
            tblMega,
            pkMega,
            'E',
            'Falha na comunicação',
            safeStringify((error as any).config || {}),
            safeStringify({
              message: `${(error as any).code || ''} - ${(error as any)
                .message || ''}`,
            })
          );

          if ((error as any).code === 'ERR_BAD_RESPONSE') {
            throw new AppError({
              statusCode: 500,
              header: 'Erro de Comunicação',
              error: {
                message: 'A API de Comunicação não esta respondendo',
              },
            });
          }
        }
      }
    }

    return { message: 'Metodo Executado' };
  }

  static async postOrdersItems(_: Request, res: Response) {
    const registros = await Integracao.buscaPedidos();

    const resp = await IntegracaoController.integraDados('I', registros);

    return res.status(200).send(resp);
  }

  static async postOrdersCanceled(_: Request, res: Response) {
    const registros = await Integracao.buscaPedidosCancelados();

    const resp = await IntegracaoController.integraDados('C', registros);

    return res.status(200).send(resp);
  }

  static async postOrdersReceived(_: Request, res: Response) {
    const registros = await Integracao.buscaRecebimentos();

    const resp = await IntegracaoController.integraDados('R', registros);

    return res.status(200).send(resp);
  }
}
