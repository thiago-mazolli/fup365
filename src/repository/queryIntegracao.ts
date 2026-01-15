export const buscaIntegracaoPendenteSDB = (findOne: boolean) => `
  select
    mod.NFD_ST_TBLMEGA,
    mod.NFD_ST_PKMEGA,
    mod.NFD_DT_DATAMOD,
    mod.NFD_DT_DATAENV,
    mod.NFD_ST_METODO,
    mod.CFG_ST_HOST,
    mod.NFD_ST_PATH,
    mod.CFG_ST_AUTHKEY,
    mod.CFG_ST_AUTHMETODO,
    mod.CFG_ST_AUTHHOST,
    mod.CFG_ST_AUTHPATH,
    mod.NFD_ST_IDME
  from TJS_INTEGRACAOMOD mod
  where nvl(mod.NFD_DT_DATAMOD, sysdate) > nvl(mod.NFD_DT_DATAENV, sysdate)
     ${findOne ? 'and mod.NFD_ST_TBLMEGA = :pNFD_ST_TBLMEGA' : ''}
     ${findOne ? 'and mod.NFD_ST_PKMEGA = :pNFD_ST_PKMEGA' : ''}
  order by
    mod.NFD_DT_DATAMOD
`;

export const updateDataEnvioPRC = `
  begin
    update
      TJS_INTEGRACAOMOD
    set
      NFD_DT_DATAENV = sysdate,
      NFD_ST_IDME = nvl(:pNFD_ST_IDME, NFD_ST_IDME)
    where NFD_ST_TBLMEGA = :pNFD_ST_TBLMEGA
      and NFD_ST_PKMEGA = :pNFD_ST_PKMEGA
    ;
  end;
`;

export const gravaLogEnvioPRC = `
  begin
    merge into
      TJS_INTEGRACAOLOG tgt using (
        select
          :pNFD_ST_TBLMEGA as NFD_ST_TBLMEGA,
          :pNFD_ST_PKMEGA as NFD_ST_PKMEGA,
          :pLOG_CH_STATUS as LOG_CH_STATUS,
          :pLOG_ST_MSG as LOG_ST_MSG,
          :pLOG_CL_REQUEST as LOG_CL_REQUEST,
          :pLOG_CL_RESPONSE as LOG_CL_RESPONSE
        from
          dual
      ) src on (
        tgt.NFD_ST_TBLMEGA = src.NFD_ST_TBLMEGA
        and tgt.NFD_ST_PKMEGA = src.NFD_ST_PKMEGA
        and 1 = 0 --PARA SEMPRE CAIR NO INSERT
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
        src.LOG_CH_STATUS,
        src.LOG_ST_MSG,
        src.LOG_CL_REQUEST,
        src.LOG_CL_RESPONSE
      )
    ;
  end;
`;
