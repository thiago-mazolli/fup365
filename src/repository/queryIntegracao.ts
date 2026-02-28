export const updateDataEnvioPRC = `
  begin
    update
      TJS_INTEGRACAOMOD
    set
      MOD_DT_DATAENV = sysdate
    where MOD_ST_TBLMEGA = :pMOD_ST_TBLMEGA
      and MOD_ST_PKMEGA = :pMOD_ST_PKMEGA;
  end;
`;

export const gravaLogEnvioPRC = `
  begin
    insert into TJS_INTEGRACAOLOG
      (LOG_DT_DATA,
       MOD_ST_TBLMEGA,
       MOD_ST_PKMEGA,
       LOG_CH_STATUS,
       LOG_ST_MSG,
       LOG_CL_REQUEST,
       LOG_CL_RESPONSE)
    values
      (sysdate,
       :pMOD_ST_TBLMEGA,
       :pMOD_ST_PKMEGA,
       :pLOG_CH_STATUS,
       :pLOG_ST_MSG,
       :pLOG_CL_REQUEST,
       :pLOG_CL_RESPONSE);
  end;
`;

export const validaEnvioSBD = `
  select
    1
  from
    TJS_INTEGRACAOMOD mod
  where
    nvl(mod.MOD_DT_DATAMOD, sysdate) > nvl(mod.MOD_DT_DATAENV, sysdate)
    and mod.MOD_ST_TBLMEGA = :pMOD_ST_TBLMEGA
    and mod.MOD_ST_PKMEGA = :pMOD_ST_PKMEGA
`;

export const buscaPedidosSDB = `
  select
    --DADOS INTEGRAÇÃO
    mod.MOD_ST_TBLMEGA as "tblMega",
    mod.MOD_ST_PKMEGA as "pkMega",
    mod.MOD_DT_DATAMOD as "dataModificacao",
    mod.MOD_DT_DATAENV as "dataEnvio",
    --DADOS PEDIDO
    to_char(ped.PDC_IN_PROCESSO) as "numero_pedido",
    null as "numero_legado",
    to_char(ped.PDC_DT_EMISSAO, 'rrrr-mm-dd hh24:mi:ss') as "data_emissao",
    pck_mega.f_retornacnpjcpf(ped.ORG_PAD_IN_CODIGO, ped.FIL_IN_CODIGO, 'S') as "cliente_cnpj",
    null as "cliente_centro",
    --DADOS FORNECEDOR
    pck_mega.f_retornacnpjcpf(agn.AGN_PAD_IN_CODIGO, agn.AGN_IN_CODIGO, 'S') as "fornecedor_cnpj",
    agn.AGN_ST_NOME as "fornecedor_razao",
    agn.AGN_ST_LOGRADOURO as "fornecedor_endereco",
    agn.AGN_ST_NUMERO as "fornecedor_numero",
    agn.AGN_ST_BAIRRO as "fornecedor_bairro",
    agn.AGN_ST_MUNICIPIO as "fornecedor_cidade",
    agn.UF_ST_SIGLA as "fornecedor_uf",
    --DADOS CONTATO
    cursor (select
              p.PAG_ST_NOME as "fornecedor_contato",
              p.PAG_ST_EMAIL as "fornecedor_email",
              p.PAG_ST_CELULAR as "fornecedor_celular",
              p.PAG_ST_TELCOMERCIAL as "fornecedor_telefone"
            from
              GLO_PESSOA_AGENTES p
            where
              p.AGN_TAB_IN_CODIGO = agn.AGN_TAB_IN_CODIGO
              and p.AGN_PAD_IN_CODIGO = agn.AGN_PAD_IN_CODIGO
              and p.AGN_IN_CODIGO = agn.AGN_IN_CODIGO
              and rownum <= 2
          ) "contatos",
    --ITENS DO PEDIDO
    cursor (select
              itn.ITP_IN_SEQUENCIA as "numero_linha",
              0 as "numero_linha_legado",
              pro.UNI_ST_UNIDADE as "unidade",
              itn.ITP_RE_VLUNITARIO as "valor",
              'BRL' as "moeda",
              to_char(ped.PDC_DT_EMISSAO, 'rrrr-mm-dd hh24:mi:ss') as "requisicao_emissao",
              to_char(ped.PDC_DT_EMISSAO, 'rrrr-mm-dd hh24:mi:ss') as "requisicao_aprovacao",
              0 as "requisicao_numero",
              0 as "requisicao_item",
              itn.PRO_IN_CODIGO as "produto_codigo",
              pro.PRO_ST_DESCRICAO as "produto_descricao",
              null as "produto_referencia",
              null as "produto_classe",
              gru.GRU_ST_NOME as "produto_grupo",
              gru.GRU_ST_NOME as "produto_categoria",
              ncm.NCM_ST_EXTENSO as "produto_ncm",
              usu.GRU_ST_NOME as "comprador_nome",
              usu.GRU_ST_EMAIL as "comprador_email",
              null as "comprador_grupo",
              null as "comprador_gestor",
              null as "tipo_compra",
              null as "requisitante_nome",
              null as "requisitante_email",
              null as "deposito",
              null as "deposito_endereco",
              ped.TPR_ST_TIPOPRECO as "incoterm",
              cursor (select
                        to_char(ent.ITP_DT_ENTREGA, 'rrrr-mm-dd hh24:mi:ss') as "previsao_entrega",
                        ent.ITPP_RE_QUANTIDADE as "quantidade",
                        0 as "prioridade"
                      from
                        EST_ITENSPEDPROGRAMADOS ent
                      where
                        ent.ORG_TAB_IN_CODIGO = itn.ORG_TAB_IN_CODIGO
                        and ent.ORG_PAD_IN_CODIGO = itn.ORG_PAD_IN_CODIGO
                        and ent.ORG_IN_CODIGO = itn.ORG_IN_CODIGO
                        and ent.ORG_TAU_ST_CODIGO = itn.ORG_TAU_ST_CODIGO
                        and ent.SER_TAB_IN_CODIGO = itn.SER_TAB_IN_CODIGO
                        and ent.SER_IN_SEQUENCIA = itn.SER_IN_SEQUENCIA
                        and ent.PDC_IN_CODIGO = itn.PDC_IN_CODIGO
                        and ent.itp_in_sequencia = itn.ITP_IN_SEQUENCIA) "entregas"
            from EST_ITENSPEDCOMPRA itn
            inner join EST_PRODUTOS pro on (
              pro.PRO_TAB_IN_CODIGO = itn.PRO_TAB_IN_CODIGO
              and pro.PRO_PAD_IN_CODIGO = itn.PRO_PAD_IN_CODIGO
              and pro.PRO_IN_CODIGO = itn.PRO_IN_CODIGO
              )
            inner join EST_GRUPOS gru on (
              gru.GRU_TAB_IN_CODIGO = pro.GRU_TAB_IN_CODIGO
              and gru.GRU_PAD_IN_CODIGO = pro.GRU_PAD_IN_CODIGO
              and gru.GRU_IDE_ST_CODIGO = pro.GRU_IDE_ST_CODIGO
              and gru.GRU_IN_CODIGO = pro.GRU_IN_CODIGO
              )
            left join TRF_NCM ncm on (
              ncm.NCM_TAB_IN_CODIGO = pro.NCM_TAB_IN_CODIGO
              and ncm.NCM_PAD_IN_CODIGO = pro.NCM_PAD_IN_CODIGO
              and ncm.NCM_IN_CODIGO = pro.NCM_IN_CODIGO
              )
            inner join GLO_GRUPO_USUARIO usu on (
              usu.GRU_IN_CODIGO = ped.GRU_IN_CODIGO
              )
            where
              itn.ORG_TAB_IN_CODIGO = ped.ORG_TAB_IN_CODIGO
              and itn.ORG_PAD_IN_CODIGO = ped.ORG_PAD_IN_CODIGO
              and itn.ORG_IN_CODIGO = ped.ORG_IN_CODIGO
              and itn.ORG_TAU_ST_CODIGO = ped.ORG_TAU_ST_CODIGO
              and itn.SER_TAB_IN_CODIGO = ped.SER_TAB_IN_CODIGO
              and itn.SER_IN_SEQUENCIA = ped.SER_IN_SEQUENCIA
              and itn.PDC_IN_CODIGO = ped.PDC_IN_CODIGO
          ) "linhas"
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
  inner join GLO_VW_TODOSAGENTES agn on (
    agn.AGN_TAB_IN_CODIGO = ped.AGN_TAB_IN_CODIGO
    and agn.AGN_PAD_IN_CODIGO = ped.AGN_PAD_IN_CODIGO
    and agn.AGN_IN_CODIGO = ped.AGN_IN_CODIGO
    and agn.AGN_TAU_ST_CODIGO = ped.AGN_TAU_ST_CODIGO
    )
  where
    nvl(mod.MOD_DT_DATAMOD, sysdate) > nvl(mod.MOD_DT_DATAENV, sysdate)
    and mod.MOD_ST_TBLMEGA = 'EST_PEDCOMPRAS'
    and nvl(mod.MOD_DT_DATAMOD, sysdate) < (sysdate - INTERVAL '2' MINUTE)
    and nvl(tjs_pck_integracao.f_status_integracao(mod.MOD_ST_TBLMEGA, mod.MOD_ST_PKMEGA), 'P') = 'P'
  order by mod.MOD_DT_DATAMOD asc
`;

export const buscaPedidosCanceladosSDB = `
  select
    --DADOS INTEGRAÇÃO
    mod.MOD_ST_TBLMEGA as "tblMega",
    mod.MOD_ST_PKMEGA as "pkMega",
    mod.MOD_DT_DATAMOD as "dataModificacao",
    mod.MOD_DT_DATAENV as "dataEnvio",
    --DADOS PEDIDO
    to_char(ped.PDC_IN_PROCESSO) as "numero_pedido",
    to_char(sysdate, 'rrrr-mm-dd hh24:mi:ss') as "cancelado_data"
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
    and mod.MOD_ST_TBLMEGA = 'EST_PEDCOMPRAS_CANC'
    and nvl(mod.MOD_DT_DATAMOD, sysdate) < (sysdate - INTERVAL '2' MINUTE)
    and nvl(tjs_pck_integracao.f_status_integracao(mod.MOD_ST_TBLMEGA, mod.MOD_ST_PKMEGA), 'P') = 'P'
  order by mod.MOD_DT_DATAMOD asc
`;

export const buscaRecebimentosSDB = `
  select
    mod.MOD_ST_TBLMEGA as "tblMega",
    mod.MOD_ST_PKMEGA as "pkMega",
    mod.MOD_DT_DATAMOD as "dataModificacao",
    mod.MOD_DT_DATAENV as "dataEnvio",
    cursor (
      select
        to_char(itp.PDC_IN_PROCESSO) as "numero_pedido",
        itp.ITP_IN_SEQUENCIA as "numero_linha",
        to_char(rec.RCB_DT_DOCUMENTO, 'rrrr-mm-dd hh24:mi:ss') as "recebimento_data",
        rec.IPR_RE_QUANTIDADE as "recebimento_quantidade",
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
    and mod.MOD_ST_TBLMEGA = 'EST_PEDIDOSRECEB'
    and nvl(mod.MOD_DT_DATAMOD, sysdate) < (sysdate - INTERVAL '2' MINUTE)
    and nvl(tjs_pck_integracao.f_status_integracao(mod.MOD_ST_TBLMEGA, mod.MOD_ST_PKMEGA), 'P') = 'P'
  order by mod.MOD_DT_DATAMOD asc
`;
