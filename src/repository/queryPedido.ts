export const cancelaPedidoPRC = `
begin
  TJS_PCK_INTEGRACAO.P_CANCELAPEDIDO(
    :pORG_TAB_IN_CODIGO,
    :pORG_PAD_IN_CODIGO,
    :pORG_IN_CODIGO,
    :pORG_TAU_ST_CODIGO,
    :pSER_TAB_IN_CODIGO,
    :pSER_IN_SEQUENCIA,
    :pPDC_IN_CODIGO
  );
end;
`;

export const buscaRecebimentosSDB = `
with
  params as (
    select
      nvl(:pDATAINI, '01/01/2000') as DATAINI,
      nvl(:pDATAFIM, '31/12/2099') as DATAFIM
    from
      dual
  )
select
  (
    ped.ORG_TAB_IN_CODIGO || ';' ||
    ped.ORG_PAD_IN_CODIGO || ';' ||
    ped.ORG_IN_CODIGO || ';' ||
    ped.ORG_TAU_ST_CODIGO || ';' ||
    ped.SER_TAB_IN_CODIGO || ';' ||
    ped.SER_IN_SEQUENCIA || ';' ||
    ped.PDC_IN_CODIGO
  ) as "codigoPedido",
  cursor (
    select
      itp.PRO_IN_CODIGO as "codigoProduto",
      rec.RCB_DT_DOCUMENTO as "dataRecebimento",
      rec.IPR_RE_QUANTIDADE as "quantidadeRecebida"
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
  ) as "itens"
from
  EST_PEDCOMPRAS ped
where
  exists (
    select
      1
    from
      EST_ITENSPEDCOMPRA itp
      inner join params on (1 = 1)
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
      and (
        rec.RCB_DT_DOCUMENTO >= params.DATAINI
        and rec.RCB_DT_DOCUMENTO <= params.DATAFIM
      )
  )
`;

export const buscaContasPagarSDB = `
with
  params as (
    select
      nvl(:pDATAINI, '01/01/2000') as DATAINI,
      nvl(:pDATAFIM, '31/12/2099') as DATAFIM
    from
      dual
  )
select
  cpa.CPA_IN_AP as "codigoTitulo",
  (
    ped.ORG_TAB_IN_CODIGO || ';' ||
    ped.ORG_PAD_IN_CODIGO || ';' ||
    ped.ORG_IN_CODIGO || ';' ||
    ped.ORG_TAU_ST_CODIGO || ';' ||
    ped.SER_TAB_IN_CODIGO || ';' ||
    ped.SER_IN_SEQUENCIA || ';' ||
    ped.PDC_IN_CODIGO
  ) as "codigoPedido",
  ped.PDC_RE_VALORMOEDA as "valorDocumento",
  cursor (
    select
      cpa.CPA_ST_PARCELA as "codigoParcela",
      cpa.MOV_DT_VENCTO as "dataVencimento",
      cpa.MOV_DT_PRORROGADO as "dataVencProrrogado",
      cpa.MOV_RE_VALOR as "valor",
      cpa.SALDO_RE_PAGAR as "valorEmAberto",
      decode(nvl(cpa.SALDO_RE_PAGAR, 0), 0, 'Pago', 'Em Aberto') as "status",
      decode(
        nvl(cpa.SALDO_RE_PAGAR, 0),
        0,
        nvl(bxa.BXMOV_DT_DATAINC, nvl(mov.MOV_DT_DATAINC, chq.CHEQ_DT_DATASTATUS)),
        null
      ) as "dataPagamento"
    from
      FIN_VW_CONTASPAGAR cpa
      left join FIN_VW_BAIXASCPA bxa on (
        bxa.BXMOV_IN_NUMLANCTOESTORNO is null
        and bxa.ORIORG_TAB_IN_CODIGO = cpa.ORG_TAB_IN_CODIGO
        and bxa.ORIORG_PAD_IN_CODIGO = cpa.ORG_PAD_IN_CODIGO
        and bxa.ORIORG_IN_CODIGO = cpa.ORG_IN_CODIGO
        and bxa.ORIORG_TAU_ST_CODIGO = cpa.ORG_TAU_ST_CODIGO
        and bxa.ORIMOV_TAB_IN_CODIGO = cpa.MOV_TAB_IN_CODIGO
        and bxa.ORIMOV_SEQ_IN_CODIGO = cpa.MOV_SEQ_IN_CODIGO
        and bxa.ORIMOV_IN_NUMLANCTO = cpa.MOV_IN_NUMLANCTO
      )
      left join FIN_REFERENCIAFIN ref on (
        ref.REF_ORG_TAB_IN_CODIGO = cpa.ORG_TAB_IN_CODIGO
        and ref.REF_ORG_PAD_IN_CODIGO = cpa.ORG_PAD_IN_CODIGO
        and ref.REF_ORG_IN_CODIGO = cpa.ORG_IN_CODIGO
        and ref.REF_ORG_TAU_ST_CODIGO = cpa.ORG_TAU_ST_CODIGO
        and ref.REF_MOV_TAB_IN_CODIGO = cpa.MOV_TAB_IN_CODIGO
        and ref.REF_MOV_SEQ_IN_CODIGO = cpa.MOV_SEQ_IN_CODIGO
        and ref.REF_MOV_IN_NUMLANCTO = cpa.MOV_IN_NUMLANCTO
      )
      left join FIN_MOVIMENTO mov on (
        mov.ORG_TAB_IN_CODIGO = ref.ORG_TAB_IN_CODIGO
        and mov.ORG_PAD_IN_CODIGO = ref.ORG_PAD_IN_CODIGO
        and mov.ORG_IN_CODIGO = ref.ORG_IN_CODIGO
        and mov.ORG_TAU_ST_CODIGO = ref.ORG_TAU_ST_CODIGO
        and mov.MOV_TAB_IN_CODIGO = ref.MOV_TAB_IN_CODIGO
        and mov.MOV_SEQ_IN_CODIGO = ref.MOV_SEQ_IN_CODIGO
        and mov.MOV_IN_NUMLANCTO = ref.MOV_IN_NUMLANCTO
      )
      left join FIN_CHEQUESBAIXAS chb on (
        chb.ORG_TAB_IN_CODIGO = cpa.ORG_TAB_IN_CODIGO
        and chb.ORG_PAD_IN_CODIGO = cpa.ORG_PAD_IN_CODIGO
        and chb.ORG_IN_CODIGO = cpa.ORG_IN_CODIGO
        and chb.ORG_TAU_ST_CODIGO = cpa.ORG_TAU_ST_CODIGO
        and chb.MOV_TAB_IN_CODIGO = cpa.MOV_TAB_IN_CODIGO
        and chb.MOV_SEQ_IN_CODIGO = cpa.MOV_SEQ_IN_CODIGO
        and chb.MOV_IN_NUMLANCTO = cpa.MOV_IN_NUMLANCTO
      )
      left join FIN_CHEQUES chq on (
        chq.CHEQ_CH_STATUS = 'B'
        and chq.ORG_TAB_IN_CODIGO = chb.ORG_TAB_IN_CODIGO
        and chq.ORG_PAD_IN_CODIGO = chb.ORG_PAD_IN_CODIGO
        and chq.ORG_IN_CODIGO = chb.ORG_IN_CODIGO
        and chq.ORG_TAU_ST_CODIGO = chb.ORG_TAU_ST_CODIGO
        and chq.CHEQ_TAB_IN_CODIGO = chb.CHEQ_TAB_IN_CODIGO
        and chq.CHEQ_SEQ_IN_CODIGO = chb.CHEQ_SEQ_IN_CODIGO
        and chq.CHEQ_IN_NUMLANCTO = chb.CHEQ_IN_NUMLANCTO
      )
    where
      cpa.ORG_TAB_IN_CODIGO = ped.ORG_TAB_IN_CODIGO
      and cpa.ORG_PAD_IN_CODIGO = ped.ORG_PAD_IN_CODIGO
      and cpa.ORG_IN_CODIGO = ped.ORG_IN_CODIGO
      and cpa.ORG_TAU_ST_CODIGO = ped.ORG_TAU_ST_CODIGO
      and cpa.ACAOM_IN_SEQUENCIA = ped.ACAOM_IN_SEQUENCIA
  ) as "parcelas"
from
  EST_PEDCOMPRAS ped
  inner join params on (1 = 1)
  inner join FIN_VW_CONTASPAGAR cpa on (
    cpa.ORG_TAB_IN_CODIGO = ped.ORG_TAB_IN_CODIGO
    and cpa.ORG_PAD_IN_CODIGO = ped.ORG_PAD_IN_CODIGO
    and cpa.ORG_IN_CODIGO = ped.ORG_IN_CODIGO
    and cpa.ORG_TAU_ST_CODIGO = ped.ORG_TAU_ST_CODIGO
    and cpa.ACAOM_IN_SEQUENCIA = ped.ACAOM_IN_SEQUENCIA
  )
where
  (
    cpa.MOV_DT_ENTRADA >= params.DATAINI
    and cpa.MOV_DT_ENTRADA <= params.DATAFIM
  )
group by
  ped.ORG_TAB_IN_CODIGO,
  ped.ORG_PAD_IN_CODIGO,
  ped.ORG_IN_CODIGO,
  ped.ORG_TAU_ST_CODIGO,
  ped.SER_TAB_IN_CODIGO,
  ped.SER_IN_SEQUENCIA,
  ped.PDC_IN_CODIGO,
  ped.ACAOM_IN_SEQUENCIA,
  cpa.CPA_IN_AP,
  ped.PDC_RE_VALORMOEDA
`;
