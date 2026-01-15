import {
  buscaIntegracaoPendenteSDB,
  gravaLogEnvioPRC,
  updateDataEnvioPRC,
} from '../repository/queryIntegracao';

import dateDBToDateJSON from '../helpers/dateDBToDateJSON';
import connectionAttributes, { disableLogs, libDir } from '../config/database';
import executaScript from '../helpers/executaScript';
import { buscaRecebimentosSDB } from '../repository/queryPedido';

export default class Integracao {
  static async buscaIntegracaoPendente(): Promise<[]> {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaIntegracaoPendenteSDB(false),
      params: {
        // pNFD_ST_TBLMEGA: tblMega,
      },
    });

    return data.map((d: any) => ({
      tblMega: d.NFD_ST_TBLMEGA,
      pkMega: d.NFD_ST_PKMEGA,
      registro: {
        ...d,
        dataModificacao: dateDBToDateJSON(d.dataModificacao),
        dataEnvio: dateDBToDateJSON(d.dataEnvio),
        webhookMetodo: d.webhookMetodo.toLowerCase(),
      },
    }));
  }

  static async buscaIntegracaoRecebimento(): Promise<[]> {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaRecebimentosSDB,
      params: {},
    });

    return data;
  }

  static async updateDataEnvio(tblMega: string, pkMega: string) {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      execSQL: true,
      script: updateDataEnvioPRC,
      params: {
        pNFD_ST_TBLMEGA: tblMega,
        pNFD_ST_PKMEGA: pkMega,
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
        pNFD_ST_TBLMEGA: tblMega,
        pNFD_ST_PKMEGA: pkMega,
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
        pNFD_ST_TBLMEGA: tblMega,
        pNFD_ST_PKMEGA: pkMega,
        pLOG_CH_STATUS: status,
        pLOG_ST_MSG: message,
        pLOG_CL_REQUEST: request || '',
        pLOG_CL_RESPONSE: response || '',
      },
    });

    return data;
  }
}
