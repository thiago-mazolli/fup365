import {
  buscaLogIntegracaoSDB,
  buscaLogSDB,
  gravaLogPRC,
} from '../repository/queryLogs';
import connectionAttributes, { libDir, disableLogs } from '../config/database';
import executaScript from '../helpers/executaScript';
import IAppError from '../interfaces/IAppError';
import formataInteger from '../helpers/formataInteger';

export default class Logs {
  static async buscaLogsGenerico() {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaLogSDB,
      params: {},
    });

    return data.map((res: any) => ({
      id: res.LOG_IN_ID,
      type: res.LOG_CH_TYPE,
      dtUpdate: res.LOG_DT_UPDATE,
      message: res.LOG_ST_MENSAGEM,
      script: res.LOG_CL_SCRIPT,
      params: res.LOG_CL_PARAMS,
      intXML: res.LOG_CL_INT_XML,
      permUpdate: res.LOG_CH_PERM_UPDATE,
      campoAdic1: res.LOG_ST_CAMPO_ADIC1,
      campoAdic2: res.LOG_ST_CAMPO_ADIC2,
      campoAdic3: res.LOG_ST_CAMPO_ADIC3,
      campoAdic4: res.LOG_ST_CAMPO_ADIC4,
      campoAdic5: res.LOG_ST_CAMPO_ADIC5,
    }));
  }

  static async buscaLogsIntegracao() {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaLogIntegracaoSDB,
      params: {},
    });

    return data.map((res: any) => ({
      id: res.LOG_IN_ID,
      intStatus: res.LOG_CH_INT_STATUS,
      dtUpdate: res.LOG_DT_UPDATE,
      message: res.LOG_ST_MENSAGEM,
      params: res.LOG_CL_PARAMS,
      permUpdate: res.LOG_CH_PERM_UPDATE,
      intServico: res.LOG_IN_INT_SERVICO,
      intXML: res.LOG_CL_INT_XML,
      intMsgErro: res.LOG_ST_INT_MSGERRO,
      intPkMega: res.LOG_ST_INT_PKMEGA,
      intCodTransacao: res.LOG_ST_INT_CODTRANSACAO,
    }));
  }

  static async gravaLog(err: IAppError) {
    await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      execSQL: true,
      script: gravaLogPRC,
      params: {
        pLOG_IN_ID: formataInteger(err.logId),
        pLOG_CH_TYPE: 'E',
        pLOG_ST_MENSAGEM: err.error || null,
        pLOG_CL_SCRIPT: err.script || null,
        pLOG_CL_PARAMS: err.params ? JSON.stringify(err.params) : null,
        pLOG_CH_PERM_UPDATE: err.permUpdate || 'N',
        pLOG_IN_INT_SERVICO: formataInteger(err.intServico),
        pLOG_CH_INT_STATUS: err.intStatus || null,
        pLOG_CL_INT_XML: err.intXML || null,
        pLOG_ST_INT_MSGERRO: err.intMsgErro || null,
        pLOG_ST_INT_PKMEGA: err.intPkMega || null,
        pLOG_ST_INT_CODTRANSACAO: err.intCodTransacao || null,
        pLOG_ST_CAMPO_ADIC1: err.campoAdic1 || null,
        pLOG_ST_CAMPO_ADIC2: err.campoAdic2 || null,
        pLOG_ST_CAMPO_ADIC3: err.campoAdic3 || null,
        pLOG_ST_CAMPO_ADIC4: err.campoAdic4 || null,
        pLOG_ST_CAMPO_ADIC5: err.campoAdic5 || null,
      },
    });

    return {
      header: 'Log Gravado com Sucesso',
      message: `O Log foi gravado com Sucesso`,
    };
  }
}
