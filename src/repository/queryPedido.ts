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
