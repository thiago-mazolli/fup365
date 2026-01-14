import { AxiosInstance } from 'axios';
import { dateDBToDateJSON } from 'dev4-code-library';
import {
  buscaNotificPendenteSDB,
  gravaLogNotificPRC,
  updateDataEnvNotificPRC,
} from '../repository/queryNotific';

import INotific from '../interfaces/INotific';

export default class Notific {
  static async buscaNotificPendente(
    apiConector: AxiosInstance,
    tblMega: string
  ): Promise<INotific[]> {
    const { data } = await apiConector.put<INotific[]>('/execScript', {
      script: buscaNotificPendenteSDB(false),
      params: {
        pNFD_ST_TBLMEGA: tblMega,
      },
    });

    return data.map(d => ({
      ...d,
      dataModificacao: dateDBToDateJSON(d.dataModificacao),
      dataEnvio: dateDBToDateJSON(d.dataEnvio),
      webhookMetodo: d.webhookMetodo.toLowerCase(),
    }));
  }

  static async updateDataEnvNotific(
    apiConector: AxiosInstance,
    tblMega: string,
    pkMega: string,
    webhookHost: string
  ) {
    const response = await apiConector.post('/execProcedure', {
      script: updateDataEnvNotificPRC,
      params: {
        pNFD_ST_TBLMEGA: tblMega,
        pNFD_ST_PKMEGA: pkMega,
        pNFD_ST_WEBHOOKHOST: webhookHost,
      },
    });

    return response.data;
  }

  static async validaEnvNotific(
    apiConector: AxiosInstance,
    tblMega: string,
    pkMega: string,
    webhookHost: string
  ) {
    const { data } = await apiConector.put('/execScript', {
      script: buscaNotificPendenteSDB(true),
      params: {
        pNFD_ST_TBLMEGA: tblMega,
        pNFD_ST_PKMEGA: pkMega,
        pNFD_ST_WEBHOOKHOST: webhookHost,
      },
    });

    return data.length > 0;
  }

  static async gravaLogNotific(
    apiConector: AxiosInstance,
    tblMega: string,
    pkMega: string,
    webhookHost: string,
    status: string,
    message: string,
    request?: string,
    response?: string
  ) {
    const resp = await apiConector.post('/execProcedure', {
      script: gravaLogNotificPRC,
      params: {
        pNFD_ST_TBLMEGA: tblMega,
        pNFD_ST_PKMEGA: pkMega,
        pNFD_ST_WEBHOOKHOST: webhookHost,
        pLOG_CH_STATUS: status,
        pLOG_ST_MSG: message,
        pLOG_CL_REQUEST: request || '',
        pLOG_CL_RESPONSE: response || '',
      },
    });

    return resp.data;
  }
}
