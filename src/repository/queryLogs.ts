export const buscaLogSDB = `
  select
    log.LOG_IN_ID,
    log.LOG_CH_TYPE,
    log.LOG_DT_UPDATE,
    log.LOG_ST_MENSAGEM,
    log.LOG_CL_SCRIPT,
    log.LOG_CL_PARAMS,
    log.LOG_CL_INT_XML,
    log.LOG_CH_PERM_UPDATE,
    log.LOG_ST_CAMPO_ADIC1,
    log.LOG_ST_CAMPO_ADIC2,
    log.LOG_ST_CAMPO_ADIC3,
    log.LOG_ST_CAMPO_ADIC4,
    log.LOG_ST_CAMPO_ADIC5
  from
    TJS_LOGS log
  where log.LOG_ST_INT_CODTRANSACAO is null
  order by
    log.LOG_IN_ID desc
`;

export const buscaLogIntegracaoSDB = `
  select
    log.LOG_IN_ID,
    log.LOG_DT_UPDATE,
    log.LOG_ST_MENSAGEM,
    log.LOG_CL_PARAMS,
    log.LOG_CH_PERM_UPDATE,
    log.LOG_IN_INT_SERVICO,
    log.LOG_CH_INT_STATUS,
    log.LOG_CL_INT_XML,
    log.LOG_ST_INT_MSGERRO,
    log.LOG_ST_INT_PKMEGA,
    log.LOG_ST_INT_CODTRANSACAO
  from
    TJS_LOGS log
  where log.LOG_ST_INT_CODTRANSACAO is not null
  order by
    log.LOG_IN_ID desc
`;

export const gravaLogPRC = `
  begin
    TJS_PCK_LOGS.P_GRAVA_LOG(
      :pLOG_IN_ID,
      :pLOG_CH_TYPE,
      :pLOG_ST_MENSAGEM,
      :pLOG_CL_SCRIPT,
      :pLOG_CL_PARAMS,
      :pLOG_CH_PERM_UPDATE,
      :pLOG_IN_INT_SERVICO,
      :pLOG_CH_INT_STATUS,
      :pLOG_CL_INT_XML,
      :pLOG_ST_INT_MSGERRO,
      :pLOG_ST_INT_PKMEGA,
      :pLOG_ST_INT_CODTRANSACAO,
      :pLOG_ST_CAMPO_ADIC1,
      :pLOG_ST_CAMPO_ADIC2,
      :pLOG_ST_CAMPO_ADIC3,
      :pLOG_ST_CAMPO_ADIC4,
      :pLOG_ST_CAMPO_ADIC5
    );
  end;
`;
