import { IAppError, formataInteger } from 'dev4-code-library';
import {
  buscaLogIntegracaoSDB,
  buscaLogSDB,
  gravaLogPRC,
} from '../repository/queryLogs';
import apiConector from '../services/apiConector';

export default class Logs {
  static async buscaLogsGenerico(usercode: number, clientid: string) {
    const resp = await apiConector(usercode, clientid).put('/execScript', {
      script: buscaLogSDB,
      params: {},
    });

    return resp.data.map((res: any) => ({
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

  static async buscaLogsIntegracao(usercode: number, clientid: string) {
    const resp = await apiConector(usercode, clientid).put('/execScript', {
      script: buscaLogIntegracaoSDB,
      params: {},
    });

    return resp.data.map((res: any) => ({
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

  static async gravaLog(usercode: number, clientid: string, err: IAppError) {
    await apiConector(usercode, clientid).post('/execProcedure', {
      script: gravaLogPRC,
      params: {
        pLOG_IN_ID: formataInteger(err.logId),
        pLOG_CH_TYPE: 'E',
        pLOG_ST_MENSAGEM: err.error || null,
        pLOG_CL_SCRIPT: err.script || null,
        pLOG_CL_PARAMS: err.params ? JSON.stringify(err.params, null, 2) : null,
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
