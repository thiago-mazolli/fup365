import { AxiosInstance } from 'axios';
import { dateDBToDateJSON } from 'dev4-code-library';
import {
  buscaIntegracaoPendenteSDB,
  gravaLogEnvioPRC,
  updateDataEnvioPRC,
} from '../repository/queryIntegracao';

import IIntegracao from '../interfaces/IIntegracao';

export default class Integracao {
  static async buscaIntegracaoPendente(
    apiConector: AxiosInstance
    // tblMega: string
  ) {
    const response = await apiConector.put('/execScript', {
      script: buscaIntegracaoPendenteSDB(false),
      params: {
        // pMOD_ST_TBLMEGA: tblMega,
      },
    });

    return response.data.map((d: any) => ({
      tblMega: d.MOD_ST_TBLMEGA,
      pkMega: d.MOD_ST_PKMEGA,
      dataModificacao: dateDBToDateJSON(d.MOD_DT_DATAMOD),
      dataEnvio: dateDBToDateJSON(d.MOD_DT_DATAENV),
      metodo: d.MOD_ST_METODO.toLowerCase(), // PRECISA SER LOWER PARA PODER ENVIAR PARA O MÉTODO CORRETO NA API
      host: d.CFG_ST_HOST,
      path: d.MOD_ST_PATH,
      authKey: d.CFG_ST_AUTHKEY,
      authMetodo: d.CFG_ST_AUTHMETODO,
      authHost: d.CFG_ST_AUTHHOST,
      authPath: d.CFG_ST_AUTHPATH,
      idMe: d.MOD_ST_IDME,
    })) as IIntegracao[];
  }

  static async updateDataEnvio(
    apiConector: AxiosInstance,
    tblMega: string,
    pkMega: string,
    idME: string
  ) {
    const response = await apiConector.post('/execProcedure', {
      script: updateDataEnvioPRC,
      params: {
        pMOD_ST_IDME: idME,
        pMOD_ST_TBLMEGA: tblMega,
        pMOD_ST_PKMEGA: pkMega,
      },
    });

    return response.data;
  }

  static async validaEnvio(
    apiConector: AxiosInstance,
    tblMega: string,
    pkMega: string
  ) {
    const { data } = await apiConector.put('/execScript', {
      script: buscaIntegracaoPendenteSDB(true),
      params: {
        pMOD_ST_TBLMEGA: tblMega,
        pMOD_ST_PKMEGA: pkMega,
      },
    });

    return data.length > 0;
  }

  static async gravaLogEnvio(
    apiConector: AxiosInstance,
    tblMega: string,
    pkMega: string,
    status: string,
    message: string,
    request?: string,
    response?: string
  ) {
    const resp = await apiConector.post('/execProcedure', {
      script: gravaLogEnvioPRC,
      params: {
        pMOD_ST_TBLMEGA: tblMega,
        pMOD_ST_PKMEGA: pkMega,
        pLOG_CH_STATUS: status,
        pLOG_ST_MSG: message,
        pLOG_CL_REQUEST: request || '',
        pLOG_CL_RESPONSE: response || '',
      },
    });

    return resp.data;
  }
}
