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
  where nvl(mod.MOD_DT_DATAMOD, sysdate) > nvl(mod.MOD_DT_DATAENV, sysdate)
    and mod.MOD_ST_TBLMEGA = :pMOD_ST_TBLMEGA
    and mod.MOD_ST_PKMEGA = :pMOD_ST_PKMEGA
`;

export const buscaPedidosSDB = `
select * from dual
`;

export const buscaPedidosCanceladosSDB = `
select * from dual
`;

export const buscaRecebimentosSDB = `
select
  mod.MOD_ST_TBLMEGA as "tblMega",
  mod.MOD_ST_PKMEGA as "pkMega",
  mod.MOD_DT_DATAMOD as "dataModificacao",
  mod.MOD_DT_DATAENV as "dataEnvio"
  to_char(sysdate, 'rrrr-mm-dd hh24:mi:ss') as "formatdatetime",
  cursor (
    select
      -- "numero_pedido": "string",
      to_char(itp.PDC_IN_CODIGO) as "numero_pedido",
      -- "numero_linha": 0,
      itp.ITP_IN_SEQUENCIA as "numero_linha",
      -- "recebimento_data": "string",
      rec.RCB_DT_DOCUMENTO as "recebimento_data",
      -- "recebimento_quantidade": 0,
      rec.IPR_RE_QUANTIDADE as "recebimento_quantidade",
      -- "recebimento_numero": 0
      rec.RCB_ST_NOTA as "recebimento_numero"
    from
      EST_ITENSPEDCOMPRA itp
      inner join EST_PEDIDOSRECEB rec on (
        rec.ORG_TAB_IN_CODIGO = itp.ORG_TAB_IN_CODIGO
        and rec.ORG_PAD_IN_CODIGO = itp.ORG_PAD_IN_CODIGO
        and rec.ORG_IN_CODIGO = itp.ORG_IN_CODIGO
        and rec.ORG_TAU_ST_CODIGO = itp.ORG_TAU_ST_CODIGO
        and rec.SER_TAB_IN_CODIGO = itp.SER_TAB_IN_CODIGO
        and rec.SER_IN_SEQUENCIA = itp.SER_IN_SEQUENCIA
        and rec.PDC_IN_CODIGO = itp.PDC_IN_CODIGO
        and rec.ITP_IN_SEQUENCIA = itp.ITP_IN_SEQUENCIA
      )
    where
      itp.ORG_TAB_IN_CODIGO = ped.ORG_TAB_IN_CODIGO
      and itp.ORG_PAD_IN_CODIGO = ped.ORG_PAD_IN_CODIGO
      and itp.ORG_IN_CODIGO = ped.ORG_IN_CODIGO
      and itp.ORG_TAU_ST_CODIGO = ped.ORG_TAU_ST_CODIGO
      and itp.SER_TAB_IN_CODIGO = ped.SER_TAB_IN_CODIGO
      and itp.SER_IN_SEQUENCIA = ped.SER_IN_SEQUENCIA
      and itp.PDC_IN_CODIGO = ped.PDC_IN_CODIGO
  ) as "pedidos"
from
  TJS_INTEGRACAOMOD mod
  inner join EST_PEDCOMPRAS ped on (
    (
      ped.ORG_TAB_IN_CODIGO || ';' ||
      ped.ORG_PAD_IN_CODIGO || ';' ||
      ped.ORG_IN_CODIGO || ';' ||
      ped.ORG_TAU_ST_CODIGO || ';' ||
      ped.SER_TAB_IN_CODIGO || ';' ||
      ped.SER_IN_SEQUENCIA || ';' ||
      ped.PDC_IN_CODIGO
    ) = mod.MOD_ST_PKMEGA
  )
where
  nvl(mod.MOD_DT_DATAMOD, sysdate) > nvl(mod.MOD_DT_DATAENV, sysdate)
  and mod.MOD_ST_TBLMEGA = 'EST_RECEBIMENTOS'
  and nvl(mod.MOD_DT_DATAMOD, sysdate) < (sysdate - INTERVAL '2' MINUTE)
`;
