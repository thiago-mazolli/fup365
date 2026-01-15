import dateDBToDateJSON from '../helpers/dateDBToDateJSON';
import connectionAttributes, { disableLogs, libDir } from '../config/database';
import executaScript from '../helpers/executaScript';
import {
  buscaPedidosSDB,
  buscaPedidosCanceladosSDB,
  buscaRecebimentosSDB,
} from '../repository/queryPedido';

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
}
