export const buscaIntegracaoPendenteSDB = (findOne: boolean) => `
  select
    nfd.NFD_ST_TBLMEGA as "tblMega",
    nfd.NFD_ST_PKMEGA as "pkMega",
    nfd.NFD_DT_DATAMOD as "dataModificacao",
    nfd.NFD_DT_DATAENV as "dataEnvio"
  from
    TJS_INTEGRACAOMOD nfd
  where
    nvl(nfd.NFD_DT_DATAMOD, sysdate) > nvl(nfd.NFD_DT_DATAENV, sysdate)
    and nfd.NFD_ST_TBLMEGA = :pNFD_ST_TBLMEGA
    and nvl(nfd.NFD_DT_DATAMOD, sysdate) < (sysdate - INTERVAL '2' MINUTE)
  order by
    nfd.NFD_DT_DATAMOD
`;

export const updateDataEnvIntegracaoPRC = `
  begin
    update
      TJS_INTEGRACAOMOD
    set
      NFD_DT_DATAENV = sysdate
    where NFD_ST_TBLMEGA = :pNFD_ST_TBLMEGA
      and NFD_ST_PKMEGA = :pNFD_ST_PKMEGA
      and NFD_ST_WEBHOOKHOST = :pNFD_ST_WEBHOOKHOST
    ;
  end;
`;

export const gravaLogIntegracaoPRC = `
  begin
    merge into
      TJS_INTEGRACAOLOG tgt using (
        select
          :pNFD_ST_TBLMEGA as NFD_ST_TBLMEGA,
          :pNFD_ST_PKMEGA as NFD_ST_PKMEGA,
          :pNFD_ST_WEBHOOKHOST as NFD_ST_WEBHOOKHOST,
          :pLOG_CH_STATUS as LOG_CH_STATUS,
          :pLOG_ST_MSG as LOG_ST_MSG,
          :pLOG_CL_REQUEST as LOG_CL_REQUEST,
          :pLOG_CL_RESPONSE as LOG_CL_RESPONSE
        from
          dual
      ) src on (
        tgt.NFD_ST_TBLMEGA = src.NFD_ST_TBLMEGA
        and tgt.NFD_ST_PKMEGA = src.NFD_ST_PKMEGA
        and tgt.NFD_ST_WEBHOOKHOST = src.NFD_ST_WEBHOOKHOST
      )
    when matched then
    update set
      tgt.LOG_CH_STATUS = src.LOG_CH_STATUS,
      tgt.LOG_ST_MSG = src.LOG_ST_MSG,
      tgt.LOG_CL_REQUEST = src.LOG_CL_REQUEST,
      tgt.LOG_CL_RESPONSE = src.LOG_CL_RESPONSE,
      tgt.LOG_DT_DATA = sysdate
    when not matched then
    insert
      (
        LOG_DT_DATA,
        NFD_ST_TBLMEGA,
        NFD_ST_PKMEGA,
        NFD_ST_WEBHOOKHOST,
        LOG_CH_STATUS,
        LOG_ST_MSG,
        LOG_CL_REQUEST,
        LOG_CL_RESPONSE
      )
    values
      (
        sysdate,
        src.NFD_ST_TBLMEGA,
        src.NFD_ST_PKMEGA,
        src.NFD_ST_WEBHOOKHOST,
        src.LOG_CH_STATUS,
        src.LOG_ST_MSG,
        src.LOG_CL_REQUEST,
        src.LOG_CL_RESPONSE
      )
    ;
  end;
`;
