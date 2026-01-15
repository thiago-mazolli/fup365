import {
  buscaIntegracaoPendenteSDB,
  gravaLogEnvioPRC,
  updateDataEnvioPRC,
} from '../repository/queryIntegracao';

import dateDBToDateJSON from '../helpers/dateDBToDateJSON';
import connectionAttributes, { disableLogs, libDir } from '../config/database';
import executaScript from '../helpers/executaScript';

export default class Integracao {
  static async buscaIntegracaoPendente(): Promise<[]> {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaIntegracaoPendenteSDB(false),
      params: {
        // pMOD_ST_TBLMEGA: tblMega,
      },
    });

    return data.map((d: any) => ({
      ...d,
      dataModificacao: dateDBToDateJSON(d.dataModificacao),
      dataEnvio: dateDBToDateJSON(d.dataEnvio),
      webhookMetodo: d.webhookMetodo.toLowerCase(),
    }));
  }

  static async updateDataEnvio(tblMega: string, pkMega: string) {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      execSQL: true,
      script: updateDataEnvioPRC,
      params: {
        pMOD_ST_TBLMEGA: tblMega,
        pMOD_ST_PKMEGA: pkMega,
      },
    });

    return data;
  }

  static async validaEnvio(tblMega: string, pkMega: string) {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaIntegracaoPendenteSDB(true),
      params: {
        pMOD_ST_TBLMEGA: tblMega,
        pMOD_ST_PKMEGA: pkMega,
      },
    });

    return data.length > 0;
  }

  static async gravaLogEnvio(
    tblMega: string,
    pkMega: string,
    status: string,
    message: string,
    request?: string,
    response?: string
  ) {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      execSQL: true,
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

    return data;
  }
}
