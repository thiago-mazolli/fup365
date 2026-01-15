export const updateDataEnvioPRC = `
  begin
    update
      TJS_INTEGRACAOMOD
    set
      MOD_DT_DATAENV = sysdate
    where MOD_ST_TBLMEGA = :pMOD_ST_TBLMEGA
      and MOD_ST_PKMEGA = :pMOD_ST_PKMEGA
      and MOD_ST_WEBHOOKHOST = :pMOD_ST_WEBHOOKHOST
    ;
  end;
`;

export const gravaLogEnvioPRC = `
  begin
    merge into
      TJS_INTEGRACAOLOG tgt using (
        select
          :pMOD_ST_TBLMEGA as MOD_ST_TBLMEGA,
          :pMOD_ST_PKMEGA as MOD_ST_PKMEGA,
          :pMOD_ST_WEBHOOKHOST as MOD_ST_WEBHOOKHOST,
          :pLOG_CH_STATUS as LOG_CH_STATUS,
          :pLOG_ST_MSG as LOG_ST_MSG,
          :pLOG_CL_REQUEST as LOG_CL_REQUEST,
          :pLOG_CL_RESPONSE as LOG_CL_RESPONSE
        from
          dual
      ) src on (
        tgt.MOD_ST_TBLMEGA = src.MOD_ST_TBLMEGA
        and tgt.MOD_ST_PKMEGA = src.MOD_ST_PKMEGA
        and tgt.MOD_ST_WEBHOOKHOST = src.MOD_ST_WEBHOOKHOST
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
        MOD_ST_TBLMEGA,
        MOD_ST_PKMEGA,
        MOD_ST_WEBHOOKHOST,
        LOG_CH_STATUS,
        LOG_ST_MSG,
        LOG_CL_REQUEST,
        LOG_CL_RESPONSE
      )
    values
      (
        sysdate,
        src.MOD_ST_TBLMEGA,
        src.MOD_ST_PKMEGA,
        src.MOD_ST_WEBHOOKHOST,
        src.LOG_CH_STATUS,
        src.LOG_ST_MSG,
        src.LOG_CL_REQUEST,
        src.LOG_CL_RESPONSE
      )
    ;
  end;
`;

export const validaEnvioSBD = `
  select
    1
  from TJS_INTEGRACAOMOD mod
  where nvl(mod.NFD_DT_DATAMOD, sysdate) > nvl(mod.NFD_DT_DATAENV, sysdate)
    and mod.NFD_ST_TBLMEGA = :pNFD_ST_TBLMEGA
    and mod.NFD_ST_PKMEGA = :pNFD_ST_PKMEGA
`;
