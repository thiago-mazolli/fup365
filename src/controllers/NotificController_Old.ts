import { Request, Response } from 'express';
import { AppError } from 'dev4-code-library';
import { Axios } from 'axios';
import apiConector from '../services/apiConector';

import apiProxpect from '../services/apiFup365';
import INotific from '../interfaces/INotific';
import Notific from '../models/Notific';
import Cotacao from '../models/Cotacao';

export default class NotificController {
  private static async enviaNotificToProxpect(
    clientid: string,
    notifics: INotific[],
    entidadeReferencia: 'pedido' | 'contrato'
  ) {
    for (let i = 0; i < notifics.length; i++) {
      const {
        webhookHost,
        webhookMetodo,
        webhookPath,
        authHost,
        authMetodo,
        authPath,
        authKey,
        tblMega,
        pkMega,
        evento,
      } = notifics[i];

      const canIntegrate = await Notific.validaEnvNotific(
        apiConector(1, clientid as string),
        tblMega,
        pkMega,
        webhookHost
      );

      if (canIntegrate) {
        const { codigoCotacao } = await (entidadeReferencia === 'pedido'
          ? Cotacao.buscaCotacaoByPedido
          : Cotacao.buscaCotacaoByContrato)(
          apiConector(1, clientid as string),
          pkMega
        );

        try {
          const auth = !authHost
            ? undefined
            : {
                host: authHost,
                metodo: authMetodo,
                path: authPath,
                key: authKey,
              };
          const resp = await apiProxpect(webhookHost, auth)[
            webhookMetodo as keyof typeof Axios
          ](`${webhookPath}`, {
            evento,
            codigoDocumento: pkMega,
            codigoCotacao,
            tipoDocumento: entidadeReferencia,
            dataEvento: new Date(),
          });

          const { data, status, statusText, request } = resp;

          if (status === 200) {
            await Notific.updateDataEnvNotific(
              apiConector(1, clientid as string),
              tblMega,
              pkMega,
              webhookHost
            );

            await Notific.gravaLogNotific(
              apiConector(1, clientid as string),
              tblMega,
              pkMega,
              webhookHost,
              'I',
              'Notificação enviada com sucesso'
            );
          } else {
            await Notific.gravaLogNotific(
              apiConector(1, clientid as string),
              tblMega,
              pkMega,
              webhookHost,
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

          await Notific.gravaLogNotific(
            apiConector(1, clientid as string),
            tblMega,
            pkMega,
            webhookHost,
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

  static async modificPedido(req: Request, res: Response) {
    const { clientid } = req.headers;

    const notifics = await Notific.buscaNotificPendente(
      apiConector(1, clientid as string),
      'EST_PEDCOMPRAS'
    );

    const resp = await NotificController.enviaNotificToProxpect(
      clientid as string,
      notifics,
      'pedido'
    );

    return res.status(200).send(resp);
  }

  static async modificContrato(req: Request, res: Response) {
    const { clientid } = req.headers;

    const notifics = await Notific.buscaNotificPendente(
      apiConector(1, clientid as string),
      'EMP_CONTRATO'
    );

    const resp = await NotificController.enviaNotificToProxpect(
      clientid as string,
      notifics,
      'contrato'
    );

    return res.status(200).send(resp);
  }
}
