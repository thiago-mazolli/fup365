import dateDBToDateJSON from '../helpers/dateDBToDateJSON';
import connectionAttributes, { disableLogs, libDir } from '../config/database';
import executaScript from '../helpers/executaScript';
import {
  gravaLogEnvioPRC,
  updateDataEnvioPRC,
  validaEnvioSBD,
  buscaPedidosSDB,
  buscaPedidosCanceladosSDB,
  buscaRecebimentosSDB,
} from '../repository/queryIntegracao';

export default class Integracao {
  static async buscaPedidos(): Promise<[]> {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaPedidosSDB,
      params: {
        // pMOD_ST_TBLMEGA: tblMega,
      },
    });

    return data.map((d: any) => ({
      tblMega: d.MOD_ST_TBLMEGA,
      pkMega: d.MOD_ST_PKMEGA,
      registro: {
        ...d,
        dataModificacao: dateDBToDateJSON(d.dataModificacao),
        dataEnvio: dateDBToDateJSON(d.dataEnvio),
      },
    }));
  }

  static async buscaPedidosCancelados(): Promise<[]> {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaPedidosCanceladosSDB,
      params: {
        // pMOD_ST_TBLMEGA: tblMega,
      },
    });

    return data.map((d: any) => ({
      tblMega: d.MOD_ST_TBLMEGA,
      pkMega: d.MOD_ST_PKMEGA,
      registro: {
        ...d,
        dataModificacao: dateDBToDateJSON(d.dataModificacao),
        dataEnvio: dateDBToDateJSON(d.dataEnvio),
      },
    }));
  }

  static async buscaRecebimentos(): Promise<[]> {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaRecebimentosSDB,
      params: {
        // pMOD_ST_TBLMEGA: tblMega,
      },
    });

    return data.map((d: any) => ({
      tblMega: d.MOD_ST_TBLMEGA,
      pkMega: d.MOD_ST_PKMEGA,
      registro: {
        ...d,
        dataModificacao: dateDBToDateJSON(d.dataModificacao),
        dataEnvio: dateDBToDateJSON(d.dataEnvio),
      },
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
      script: validaEnvioSBD,
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
