create or replace package body TJS_PCK_LOGS as
  procedure P_GRAVA_LOG(
    pLOG_IN_ID TJS_LOGS.LOG_IN_ID % type,
    pLOG_CH_TYPE TJS_LOGS.LOG_CH_TYPE % type,
    pLOG_ST_MENSAGEM TJS_LOGS.LOG_ST_MENSAGEM % type,
    pLOG_CL_SCRIPT TJS_LOGS.LOG_CL_SCRIPT % type,
    pLOG_CL_PARAMS TJS_LOGS.LOG_CL_PARAMS % type,
    pLOG_CH_PERM_UPDATE TJS_LOGS.LOG_CH_PERM_UPDATE % type,
    pLOG_IN_INT_SERVICO TJS_LOGS.LOG_IN_INT_SERVICO % type,
    pLOG_CH_INT_STATUS TJS_LOGS.LOG_CH_INT_STATUS % type,
    pLOG_CL_INT_XML TJS_LOGS.LOG_CL_INT_XML % type,
    pLOG_ST_INT_MSGERRO TJS_LOGS.LOG_ST_INT_MSGERRO % type,
    pLOG_ST_INT_PKMEGA TJS_LOGS.LOG_ST_INT_PKMEGA % type,
    pLOG_ST_INT_CODTRANSACAO TJS_LOGS.LOG_ST_INT_CODTRANSACAO % type,
    pLOG_ST_CAMPO_ADIC1 TJS_LOGS.LOG_ST_CAMPO_ADIC1 % type,
    pLOG_ST_CAMPO_ADIC2 TJS_LOGS.LOG_ST_CAMPO_ADIC2 % type,
    pLOG_ST_CAMPO_ADIC3 TJS_LOGS.LOG_ST_CAMPO_ADIC3 % type,
    pLOG_ST_CAMPO_ADIC4 TJS_LOGS.LOG_ST_CAMPO_ADIC4 % type,
    pLOG_ST_CAMPO_ADIC5 TJS_LOGS.LOG_ST_CAMPO_ADIC5 % type
  ) is
  begin
    merge into
      TJS_LOGS old using (
        select
          pLOG_IN_ID as LOG_IN_ID,
          pLOG_CH_TYPE as LOG_CH_TYPE,
          pLOG_ST_MENSAGEM as LOG_ST_MENSAGEM,
          pLOG_CL_SCRIPT as LOG_CL_SCRIPT,
          pLOG_CL_PARAMS as LOG_CL_PARAMS,
          pLOG_CH_PERM_UPDATE as LOG_CH_PERM_UPDATE,
          pLOG_IN_INT_SERVICO as LOG_IN_INT_SERVICO,
          pLOG_CH_INT_STATUS as LOG_CH_INT_STATUS,
          pLOG_CL_INT_XML as LOG_CL_INT_XML,
          pLOG_ST_INT_MSGERRO as LOG_ST_INT_MSGERRO,
          pLOG_ST_INT_PKMEGA as LOG_ST_INT_PKMEGA,
          pLOG_ST_INT_CODTRANSACAO as LOG_ST_INT_CODTRANSACAO,
          pLOG_ST_CAMPO_ADIC1 as LOG_ST_CAMPO_ADIC1,
          pLOG_ST_CAMPO_ADIC2 as LOG_ST_CAMPO_ADIC2,
          pLOG_ST_CAMPO_ADIC3 as LOG_ST_CAMPO_ADIC3,
          pLOG_ST_CAMPO_ADIC4 as LOG_ST_CAMPO_ADIC4,
          pLOG_ST_CAMPO_ADIC5 as LOG_ST_CAMPO_ADIC5
        from
          dual
      ) new on (
        old.LOG_CH_PERM_UPDATE = 'S'
        and old.LOG_IN_ID = new.LOG_IN_ID
      )
    when matched then
    update set
      old.LOG_CH_TYPE = new.LOG_CH_TYPE,
      old.LOG_DT_UPDATE = sysdate,
      old.LOG_ST_MENSAGEM = new.LOG_ST_MENSAGEM,
      old.LOG_CL_SCRIPT = new.LOG_CL_SCRIPT,
      old.LOG_CL_PARAMS = new.LOG_CL_PARAMS,
      old.LOG_IN_INT_SERVICO = new.LOG_IN_INT_SERVICO,
      old.LOG_CH_INT_STATUS = new.LOG_CH_INT_STATUS,
      old.LOG_CL_INT_XML = new.LOG_CL_INT_XML,
      old.LOG_ST_INT_MSGERRO = new.LOG_ST_INT_MSGERRO,
      old.LOG_ST_INT_PKMEGA = new.LOG_ST_INT_PKMEGA,
      old.LOG_ST_INT_CODTRANSACAO = new.LOG_ST_INT_CODTRANSACAO,
      old.LOG_ST_CAMPO_ADIC1 = new.LOG_ST_CAMPO_ADIC1,
      old.LOG_ST_CAMPO_ADIC2 = new.LOG_ST_CAMPO_ADIC2,
      old.LOG_ST_CAMPO_ADIC3 = new.LOG_ST_CAMPO_ADIC3,
      old.LOG_ST_CAMPO_ADIC4 = new.LOG_ST_CAMPO_ADIC4,
      old.LOG_ST_CAMPO_ADIC5 = new.LOG_ST_CAMPO_ADIC5
    when not matched then
    insert
      (
        LOG_IN_ID,
        LOG_CH_TYPE,
        LOG_DT_INSERT,
        LOG_DT_UPDATE,
        LOG_ST_MENSAGEM,
        LOG_CL_SCRIPT,
        LOG_CL_PARAMS,
        LOG_CH_PERM_UPDATE,
        LOG_IN_INT_SERVICO,
        LOG_CH_INT_STATUS,
        LOG_CL_INT_XML,
        LOG_ST_INT_MSGERRO,
        LOG_ST_INT_PKMEGA,
        LOG_ST_INT_CODTRANSACAO,
        LOG_ST_CAMPO_ADIC1,
        LOG_ST_CAMPO_ADIC2,
        LOG_ST_CAMPO_ADIC3,
        LOG_ST_CAMPO_ADIC4,
        LOG_ST_CAMPO_ADIC5
      )
    values
      (
        TJS_S_LOGID.nextval,
        new.LOG_CH_TYPE,
        sysdate,
        sysdate,
        new.LOG_ST_MENSAGEM,
        new.LOG_CL_SCRIPT,
        new.LOG_CL_PARAMS,
        new.LOG_CH_PERM_UPDATE,
        new.LOG_IN_INT_SERVICO,
        new.LOG_CH_INT_STATUS,
        new.LOG_CL_INT_XML,
        new.LOG_ST_INT_MSGERRO,
        new.LOG_ST_INT_PKMEGA,
        new.LOG_ST_INT_CODTRANSACAO,
        new.LOG_ST_CAMPO_ADIC1,
        new.LOG_ST_CAMPO_ADIC2,
        new.LOG_ST_CAMPO_ADIC3,
        new.LOG_ST_CAMPO_ADIC4,
        new.LOG_ST_CAMPO_ADIC5
      )
    ;
  end P_GRAVA_LOG;
end TJS_PCK_LOGS;
