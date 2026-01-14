create or replace package body TJS_PCK_INTEGRACAO is

  -- Author  : THIAGO MAZOLLI
  -- Created : 30/09/2025 10:00:00
  -- Purpose : API DE INTEGRAÇÃO MERCADO ELETRÔNICO

  procedure P_CRIA_INTEGRACAO(
    pMOD_ST_TBLMEGA in TJS_INTEGRACAOMOD.MOD_ST_TBLMEGA%type,
    pMOD_ST_PKMEGA  in TJS_INTEGRACAOMOD.MOD_ST_PKMEGA%type
  ) is
    vMetodo varchar2(10);
  begin
    FOR rCfg in (
      select
        cfg.CFG_ST_HOST,
        cfg.CFG_ST_AUTHKEY,
        cfg.CFG_ST_AUTHMETODO,
        cfg.CFG_ST_AUTHHOST,
        cfg.CFG_ST_AUTHPATH
      from
        TJS_INTEGRACAOCFG cfg
      where
        rownum = 1
    ) --FILTRAR POSSÍVEIS LINKS DE HOMOLOGAÇÃO/PRODUÇÃO
    loop
      --VERIFICA SE JÁ FOI INTEGRADO PARA ALTERAR O TIPO DE MÉTODO QUE SERÁ UTLIZADO NA INTEGRAÇÃO
      begin
        select
          decode(count(1), 0, 'POST', 'PUT')
        into
          vMetodo
        from
          TJS_integracaolog i
        where
          i.MOD_ST_TBLMEGA = pMOD_ST_TBLMEGA
          and i.MOD_ST_PKMEGA = pMOD_ST_PKMEGA
          and i.log_ch_status = 'I'
        ;
      exception
        when others then
          vMetodo := 'POST';
      end;

      merge into
        TJS_INTEGRACAOMOD tgt using (
          select
            pMOD_ST_TBLMEGA as MOD_ST_TBLMEGA,
            pMOD_ST_PKMEGA as MOD_ST_PKMEGA,
            sysdate as MOD_DT_DATAMOD,
            (sysdate - 1) as MOD_DT_DATAENV,
            vMetodo as MOD_ST_METODO,
            rCfg.CFG_ST_HOST as CFG_ST_HOST,
            '/v1/suppliers' as MOD_ST_PATH,
            rCfg.CFG_ST_AUTHKEY as CFG_ST_AUTHKEY,
            rCfg.CFG_ST_AUTHMETODO as CFG_ST_AUTHMETODO,
            rCfg.CFG_ST_AUTHHOST as CFG_ST_AUTHHOST,
            rCfg.CFG_ST_AUTHPATH as CFG_ST_AUTHPATH
          from
            dual
        ) src on (
          tgt.MOD_ST_TBLMEGA = src.MOD_ST_TBLMEGA
          and tgt.MOD_ST_PKMEGA = src.MOD_ST_PKMEGA
        )
      when matched then
      update set
        tgt.MOD_DT_DATAMOD = src.MOD_DT_DATAMOD,
        tgt.MOD_ST_METODO = src.MOD_ST_METODO,
        tgt.CFG_ST_HOST = src.CFG_ST_HOST,
        tgt.MOD_ST_PATH = src.MOD_ST_PATH,
        tgt.CFG_ST_AUTHKEY = src.CFG_ST_AUTHKEY,
        tgt.CFG_ST_AUTHMETODO = src.CFG_ST_AUTHMETODO,
        tgt.CFG_ST_AUTHHOST = src.CFG_ST_AUTHHOST,
        tgt.CFG_ST_AUTHPATH = src.CFG_ST_AUTHPATH
      when not matched then
      insert
        (
          MOD_ST_TBLMEGA,
          MOD_ST_PKMEGA,
          MOD_DT_DATAMOD,
          MOD_DT_DATAENV,
          MOD_ST_METODO,
          CFG_ST_HOST,
          MOD_ST_PATH,
          CFG_ST_AUTHKEY,
          CFG_ST_AUTHMETODO,
          CFG_ST_AUTHHOST,
          CFG_ST_AUTHPATH
        )
      values
        (
          src.MOD_ST_TBLMEGA,
          src.MOD_ST_PKMEGA,
          src.MOD_DT_DATAMOD,
          src.MOD_DT_DATAENV,
          src.MOD_ST_METODO,
          src.CFG_ST_HOST,
          src.MOD_ST_PATH,
          src.CFG_ST_AUTHKEY,
          src.CFG_ST_AUTHMETODO,
          src.CFG_ST_AUTHHOST,
          src.CFG_ST_AUTHPATH
        )
      ;

    end loop;

  end P_CRIA_INTEGRACAO;

  procedure P_CRIA_NOTIFIC(
    pNFD_ST_TBLMEGA TJS_NOTIFICMOD.NFD_ST_TBLMEGA%type,
    pNFD_ST_PKMEGA TJS_NOTIFICMOD.NFD_ST_PKMEGA%type,
    pNFD_ST_WEBHOOKPATH TJS_NOTIFICMOD.NFD_ST_WEBHOOKPATH%type,
    pNFD_ST_EVENTODESC TJS_NOTIFICMOD.NFD_ST_EVENTODESC%type
  ) is
  begin
    for rCFG in (
      select
        cfg.NFD_ST_WEBHOOKMETODO,
        cfg.NFD_ST_WEBHOOKHOST,
        cfg.NFD_ST_AUTHKEY,
        cfg.NFD_ST_AUTHMETODO,
        cfg.NFD_ST_AUTHHOST,
        cfg.NFD_ST_AUTHPATH
      from
        TJS_NOTIFICCFG cfg
      where
        cfg.NFD_ST_WEBHOOKHOST is not null
    ) loop
      merge into
        TJS_NOTIFICMOD tgt using (
          select
            pNFD_ST_TBLMEGA as NFD_ST_TBLMEGA,
            pNFD_ST_PKMEGA as NFD_ST_PKMEGA,
            sysdate as NFD_DT_DATAMOD,
            (sysdate - 1) as NFD_DT_DATAENV,
            rCFG.NFD_ST_WEBHOOKMETODO as NFD_ST_WEBHOOKMETODO,
            rCFG.NFD_ST_WEBHOOKHOST as NFD_ST_WEBHOOKHOST,
            pNFD_ST_WEBHOOKPATH as NFD_ST_WEBHOOKPATH,
            rCFG.NFD_ST_AUTHKEY as NFD_ST_AUTHKEY,
            rCFG.NFD_ST_AUTHMETODO as NFD_ST_AUTHMETODO,
            rCFG.NFD_ST_AUTHHOST as NFD_ST_AUTHHOST,
            rCFG.NFD_ST_AUTHPATH as NFD_ST_AUTHPATH,
            pNFD_ST_EVENTODESC as NFD_ST_EVENTODESC
          from
            dual
        ) src on (
          tgt.NFD_ST_TBLMEGA = src.NFD_ST_TBLMEGA
          and tgt.NFD_ST_PKMEGA = src.NFD_ST_PKMEGA
          and tgt.NFD_ST_WEBHOOKHOST = src.NFD_ST_WEBHOOKHOST
        )
      when matched then
      update set
        tgt.NFD_DT_DATAMOD = src.NFD_DT_DATAMOD,
        tgt.NFD_ST_WEBHOOKMETODO = src.NFD_ST_WEBHOOKMETODO,
        tgt.NFD_ST_WEBHOOKPATH = src.NFD_ST_WEBHOOKPATH,
        tgt.NFD_ST_AUTHKEY = src.NFD_ST_AUTHKEY,
        tgt.NFD_ST_AUTHMETODO = src.NFD_ST_AUTHMETODO,
        tgt.NFD_ST_AUTHHOST = src.NFD_ST_AUTHHOST,
        tgt.NFD_ST_AUTHPATH = src.NFD_ST_AUTHPATH,
        tgt.NFD_ST_EVENTODESC = src.NFD_ST_EVENTODESC
      when not matched then
      insert
        (
          NFD_ST_TBLMEGA,
          NFD_ST_PKMEGA,
          NFD_DT_DATAMOD,
          NFD_DT_DATAENV,
          NFD_ST_WEBHOOKMETODO,
          NFD_ST_WEBHOOKHOST,
          NFD_ST_WEBHOOKPATH,
          NFD_ST_AUTHKEY,
          NFD_ST_AUTHMETODO,
          NFD_ST_AUTHHOST,
          NFD_ST_AUTHPATH,
          NFD_ST_EVENTODESC
        )
      values
        (
          src.NFD_ST_TBLMEGA,
          src.NFD_ST_PKMEGA,
          src.NFD_DT_DATAMOD,
          src.NFD_DT_DATAENV,
          src.NFD_ST_WEBHOOKMETODO,
          src.NFD_ST_WEBHOOKHOST,
          src.NFD_ST_WEBHOOKPATH,
          src.NFD_ST_AUTHKEY,
          src.NFD_ST_AUTHMETODO,
          src.NFD_ST_AUTHHOST,
          src.NFD_ST_AUTHPATH,
          src.NFD_ST_EVENTODESC
        )
      ;
    end loop;
  end P_CRIA_NOTIFIC;

  -- MANTENDO O VINCULO ENTRE SOLICITAÇÃO E COTAÇÃO
  procedure P_GERACOTACAO (
    pCOT_ST_ORIGEM TJS_COTACAO.COT_ST_ORIGEM%type,
    pCOT_ST_ID TJS_COTACAO.COT_ST_ID%type
  ) as
    vCOT_IN_CODIGO EST_COTACOES.COT_IN_CODIGO%type;
    vCFS_IN_SEQUENCIAL EST_COTAFILIALSOLIC.CFS_IN_SEQUENCIAL%type;
    vInsereCapa char(1);
  begin
    vCOT_IN_CODIGO := null;
    vInsereCapa := 'S';
    for rCot in (
      select
        cot.FIL_IN_CODIGO,
        decode(cot.COT_ST_ORIGEM, 'PP', 'Proxpect', 'ME', 'Mercado Eletrônico') as COT_ST_ORIGEM,
        cot.COT_ST_ID,
        coi.FOR_IN_CODIGO,
        coi.COI_CH_FECHADO,
        coi.COI_RE_QUANTIDADE,
        coi.COI_RE_VALORUNITARIO,
        sol.ORG_TAB_IN_CODIGO,
        sol.ORG_PAD_IN_CODIGO,
        sol.ORG_IN_CODIGO,
        sol.ORG_TAU_ST_CODIGO,
        sol.SER_TAB_IN_CODIGO,
        sol.SER_IN_SEQUENCIA,
        sol.SOL_IN_CODIGO,
        cos.SOI_IN_CODIGO,
        its.PRO_TAB_IN_CODIGO,
        its.PRO_PAD_IN_CODIGO,
        its.PRO_IN_CODIGO,
        its.APL_TAB_IN_CODIGO,
        its.APL_PAD_IN_CODIGO,
        its.APL_IN_CODIGO,
        its.TPC_TAB_IN_CODIGO,
        its.TPC_PAD_IN_CODIGO,
        its.TPC_ST_CLASSE,
        its.COS_IN_CODIGO,
        its.FMT_TAB_IN_CODIGO,
        its.FMT_PAD_IN_CODIGO,
        its.FMT_ST_CODIGO,
        pro.UNI_ST_UNIDADE
      from
        TJS_COTACAO cot
        inner join GLO_VW_ORGANIZACAO org on (org.ORG_IN_CODIGO = cot.FIL_IN_CODIGO)
        inner join TJS_COTITENS coi on (
          coi.COT_ST_ORIGEM = cot.COT_ST_ORIGEM
          and coi.COT_ST_ID = cot.COT_ST_ID
        )
        inner join TJS_COTITEMSOLIC cos on (
          cos.COT_ST_ORIGEM = coi.COT_ST_ORIGEM
          and cos.COT_ST_ID = coi.COT_ST_ID
          and cos.PRO_IN_CODIGO = coi.PRO_IN_CODIGO
        )
        inner join EST_ITENSSOLI its on (
          its.ORG_TAB_IN_CODIGO = org.PAI_ORG_TAB_IN_CODIGO
          and its.ORG_PAD_IN_CODIGO = org.PAI_ORG_PAD_IN_CODIGO
          and its.ORG_IN_CODIGO = org.PAI_ORG_IN_CODIGO
          and its.ORG_TAU_ST_CODIGO = org.ORG_TAU_ST_CODIGO
          and its.SER_TAB_IN_CODIGO = 125
          -- and its.SER_IN_SEQUENCIA =
          and its.SOL_IN_CODIGO = cos.SOL_IN_CODIGO
          and its.SOI_IN_CODIGO = cos.SOI_IN_CODIGO
        )
        inner join EST_SOLICITACAO sol on (
          sol.ORG_TAB_IN_CODIGO = its.ORG_TAB_IN_CODIGO
          and sol.ORG_PAD_IN_CODIGO = its.ORG_PAD_IN_CODIGO
          and sol.ORG_IN_CODIGO = its.ORG_IN_CODIGO
          and sol.ORG_TAU_ST_CODIGO = its.ORG_TAU_ST_CODIGO
          and sol.SER_TAB_IN_CODIGO = its.SER_TAB_IN_CODIGO
          and sol.SER_IN_SEQUENCIA = its.SER_IN_SEQUENCIA
          and sol.SOL_IN_CODIGO = its.SOL_IN_CODIGO
        )
        inner join EST_PRODUTOS pro on (
          pro.PRO_TAB_IN_CODIGO = its.PRO_TAB_IN_CODIGO
          and pro.PRO_PAD_IN_CODIGO = its.PRO_PAD_IN_CODIGO
          and pro.PRO_IN_CODIGO = its.PRO_IN_CODIGO
        )
      where
        cot.COT_ST_ORIGEM = pCOT_ST_ORIGEM
        and cot.COT_ST_ID = pCOT_ST_ID
    ) loop
      if (vInsereCapa = 'S') then
        -- Adiciona a sequencia se não existir
        merge into
          GLO_TABORGSEQUENCIA t using (
            select
              rCot.ORG_TAB_IN_CODIGO as ORG_TAB_IN_CODIGO,
              rCot.ORG_PAD_IN_CODIGO as ORG_PAD_IN_CODIGO,
              rCot.ORG_IN_CODIGO as ORG_IN_CODIGO,
              110 as TAB_IN_CODIGO,
              rCot.SER_IN_SEQUENCIA as SEQ_IN_CODIGO
            from
              dual
          ) s on (
            t.ORG_PAD_IN_CODIGO = s.ORG_PAD_IN_CODIGO
            and t.ORG_IN_CODIGO = s.ORG_IN_CODIGO
            and t.TAB_IN_CODIGO = s.TAB_IN_CODIGO
            and t.SEQ_IN_CODIGO = s.SEQ_IN_CODIGO
          )
        when not matched then
        insert
          (
            t.ORG_TAB_IN_CODIGO,
            t.ORG_PAD_IN_CODIGO,
            t.ORG_IN_CODIGO,
            t.ORG_TAU_ST_CODIGO,
            t.TAB_IN_CODIGO,
            t.SEQ_IN_CODIGO,
            t.TSEQ_IN_SEQUENCIA
          )
        values
          (
            s.ORG_TAB_IN_CODIGO,
            s.ORG_PAD_IN_CODIGO,
            s.ORG_IN_CODIGO,
            'G',
            s.TAB_IN_CODIGO,
            s.SEQ_IN_CODIGO,
            1
          )
        ;
        commit;

        select
          PCK_MEGA.PROXIMASEQUENCIAORG(rCot.ORG_IN_CODIGO, 110, 1) as COT_IN_CODIGO
        into
          vCOT_IN_CODIGO
        from
          dual
        ;

        -- CRIA UMA COTAÇÃO COM O FORNECEDOR VENCEDOR PARA MANTER O VÍNCULO ENTRE PEDIDO, COTAÇÃO E SOLICITAÇÃO
        insert into
          EST_COTACOES (
            ORG_TAB_IN_CODIGO,
            ORG_PAD_IN_CODIGO,
            ORG_IN_CODIGO,
            ORG_TAU_ST_CODIGO,
            SER_TAB_IN_CODIGO,
            SER_IN_SEQUENCIA,
            COT_IN_CODIGO,
            FIL_IN_CODIGO,
            COT_DT_EMISSAO,
            COT_ST_DESCRICAO,
            USU_IN_COMPRADOR,
            USU_IN_INCLUSAO,
            USU_IN_COTACAO,
            COT_ST_ENCERRADO,
            COT_BO_EMCOTACAO,
            COT_BO_CALCISS,
            COT_BO_FRETE,
            COT_BO_SEGURO,
            COT_BO_DESPACESSORIA,
            COT_BO_PZENTREGA,
            COT_BO_ROTATIVIDADE,
            COT_BO_SREAJUSTE,
            COT_BO_IPI,
            COT_BO_ICMS
          )
        values
          (
            rCot.ORG_TAB_IN_CODIGO, -- ORG_TAB_IN_CODIGO
            rCot.ORG_PAD_IN_CODIGO, -- ORG_PAD_IN_CODIGO
            rCot.ORG_IN_CODIGO, -- ORG_IN_CODIGO
            rCot.ORG_TAU_ST_CODIGO, -- ORG_TAU_ST_CODIGO
            110, -- SER_TAB_IN_CODIGO
            rCot.SER_IN_SEQUENCIA, -- SER_IN_SEQUENCIA
            vCOT_IN_CODIGO, -- COT_IN_CODIGO
            rCot.FIL_IN_CODIGO, -- FIL_IN_CODIGO
            trunc(sysdate), -- COT_DT_EMISSAO
            'Cotado via Integração (' || rCot.COT_ST_ORIGEM || ') - ' || rCot.COT_ST_ID, --COT_ST_DESCRICAO -- COT_ST_DESCRICAO
            1, -- USU_IN_COMPRADOR
            1, -- USU_IN_INCLUSAO
            1, -- USU_IN_COTACAO
            'N', -- COT_ST_ENCERRADO
            'N', -- COT_BO_EMCOTACAO
            'N', -- COT_BO_CALCISS
            'N', -- COT_BO_FRETE
            'N', -- COT_BO_SEGURO
            'N', -- COT_BO_DESPACESSORIA
            'N', -- COT_BO_PZENTREGA
            'N', -- COT_BO_ROTATIVIDADE
            'N', -- COT_BO_SREAJUSTE
            'N', -- COT_BO_IPI
            'N' -- COT_BO_ICMS
          )
        ;

        -- CRIA UMA OCORRÊNCIA NA COTAÇÃO
        insert into
          EST_COTACAOOCOR (
            ORG_TAB_IN_CODIGO,
            ORG_PAD_IN_CODIGO,
            ORG_IN_CODIGO,
            ORG_TAU_ST_CODIGO,
            SER_TAB_IN_CODIGO,
            SER_IN_SEQUENCIA,
            COT_IN_CODIGO,
            OCOT_IN_SEQUENCIA,
            OCOT_ST_DESCRICAO,
            OCOT_CH_TIPO,
            USU_IN_INCLUSAO,
            OCOT_DT_INCLUSAO,
            USU_IN_ALTERA,
            OCOT_DT_ALTERA,
            FIL_IN_CODIGO
          )
        values
          (
            rCot.ORG_TAB_IN_CODIGO, -- ORG_TAB_IN_CODIGO
            rCot.ORG_PAD_IN_CODIGO, -- ORG_PAD_IN_CODIGO
            rCot.ORG_IN_CODIGO, -- ORG_IN_CODIGO
            rCot.ORG_TAU_ST_CODIGO, -- ORG_TAU_ST_CODIGO
            110, -- SER_TAB_IN_CODIGO
            rCot.SER_IN_SEQUENCIA, -- SER_IN_SEQUENCIA
            vCOT_IN_CODIGO, -- COT_IN_CODIGO
            1, -- OCOT_IN_SEQUENCIA
            'Ocorrência gerada automaticamente pela aprovação via Integração (' || rCot.COT_ST_ORIGEM || ')', -- OCOT_ST_DESCRICAO
            'A', -- OCOT_CH_TIPO
            1, -- USU_IN_INCLUSAO
            sysdate, -- OCOT_DT_INCLUSAO
            1, -- USU_IN_ALTERA
            trunc(sysdate), -- OCOT_DT_ALTERA
            rCot.FIL_IN_CODIGO -- FIL_IN_CODIGO
          )
        ;

        vInsereCapa := 'N';
      end if;

      insert into
        EST_ITENSCOTFOR (
          ORG_TAB_IN_CODIGO,
          ORG_PAD_IN_CODIGO,
          ORG_IN_CODIGO,
          ORG_TAU_ST_CODIGO,
          SER_TAB_IN_CODIGO,
          SER_IN_SEQUENCIA,
          COT_IN_CODIGO,
          AGN_TAB_IN_CODIGO,
          AGN_PAD_IN_CODIGO,
          AGN_IN_CODIGO,
          AGN_TAU_ST_CODIGO,
          IND_IN_CODIGO,
          COF_DT_VALIDADE,
          TPR_TAB_IN_CODIGO,
          TPR_PAD_IN_CODIGO,
          TPR_ST_TIPOPRECO,
          COF_ST_SUJREAJ,
          COF_RE_VLFRETE,
          COF_RE_VLDESCONTO,
          COF_ST_OBSERVACAO,
          COF_RE_VLDESPESA,
          COF_RE_PEFINANC,
          COF_RE_VLINDICE,
          COF_IN_DIASENTREGA,
          COF_RE_PEFRETE,
          COF_RE_PEDESCONTO,
          COF_CH_INCISS,
          COF_CH_INCIRRF,
          COF_CH_INCINSS,
          COF_CH_STATUSCONDICAO
        )
      values
        (
          rCot.ORG_TAB_IN_CODIGO, -- ORG_TAB_IN_CODIGO
          rCot.ORG_PAD_IN_CODIGO, -- ORG_PAD_IN_CODIGO
          rCot.ORG_IN_CODIGO, -- ORG_IN_CODIGO
          rCot.ORG_TAU_ST_CODIGO, -- ORG_TAU_ST_CODIGO
          110, -- SER_TAB_IN_CODIGO
          rCot.SER_IN_SEQUENCIA, -- SER_IN_SEQUENCIA
          vCOT_IN_CODIGO, -- COT_IN_CODIGO
          53, -- AGN_TAB_IN_CODIGO
          rCot.ORG_PAD_IN_CODIGO, -- AGN_PAD_IN_CODIGO
          rCot.FOR_IN_CODIGO, -- AGN_IN_CODIGO
          'F', -- AGN_TAU_ST_CODIGO
          0, -- IND_IN_CODIGO
          trunc(sysdate), -- COF_DT_VALIDADE
          120, -- TPR_TAB_IN_CODIGO
          1, -- TPR_PAD_IN_CODIGO
          'CIF', -- TPR_ST_TIPOPRECO
          'NS', -- COF_ST_SUJREAJ
          0, -- COF_RE_VLFRETE
          0, -- COF_RE_VLDESCONTO
          decode(rCot.COI_CH_FECHADO, 'S',
            'Fornecedor vencedor da Cotação via Integração (' || rCot.COT_ST_ORIGEM || ')',
            'Fornecedor considerado na Cotação via Integração (' || rCot.COT_ST_ORIGEM || ')'
          ), -- COF_ST_OBSERVACAO
          0, -- COF_RE_VLDESPESA
          0, -- COF_RE_PEFINANC
          0, -- COF_RE_VLINDICE
          0, -- COF_IN_DIASENTREGA
          0, -- COF_RE_PEFRETE
          0, -- COF_RE_PEDESCONTO
          'S', -- COF_CH_INCISS
          'S', -- COF_CH_INCIRRF
          'S', -- COF_CH_INCINSS
          'U' -- COF_CH_STATUSCONDICAO
        )
      ;

      -- INSERE OS ITENS DO PEDIDO NA TABELA DE ITENS DA COTAÇÃO
      merge into
        EST_ITENSCOTA tgt using (
          select
            rCot.ORG_TAB_IN_CODIGO as ORG_TAB_IN_CODIGO,
            rCot.ORG_PAD_IN_CODIGO as ORG_PAD_IN_CODIGO,
            rCot.ORG_IN_CODIGO as ORG_IN_CODIGO,
            rCot.ORG_TAU_ST_CODIGO as ORG_TAU_ST_CODIGO,
            110 as SER_TAB_IN_CODIGO,
            rCot.SER_IN_SEQUENCIA as SER_IN_SEQUENCIA,
            vCOT_IN_CODIGO as COT_IN_CODIGO,
            rCot.SOI_IN_CODIGO as COI_IN_CODIGO,
            rCot.PRO_TAB_IN_CODIGO as PRO_TAB_IN_CODIGO,
            rCot.PRO_PAD_IN_CODIGO as PRO_PAD_IN_CODIGO,
            rCot.PRO_IN_CODIGO as PRO_IN_CODIGO,
            rCot.APL_TAB_IN_CODIGO as APL_TAB_IN_CODIGO,
            rCot.APL_PAD_IN_CODIGO as APL_PAD_IN_CODIGO,
            rCot.APL_IN_CODIGO as APL_IN_CODIGO,
            rCot.TPC_TAB_IN_CODIGO as TPC_TAB_IN_CODIGO,
            rCot.TPC_PAD_IN_CODIGO as TPC_PAD_IN_CODIGO,
            rCot.TPC_ST_CLASSE as TPC_ST_CLASSE,
            rCot.COS_IN_CODIGO as COS_IN_CODIGO,
            rCot.COI_RE_QUANTIDADE as COI_RE_QTDSUGERIDA,
            rCot.COI_RE_QUANTIDADE as COI_RE_QTDMINIMA,
            'N' as COI_ST_ENCERRADO,
            trunc(sysdate) as COI_DT_INCLUSAO,
            trunc(sysdate) as COI_DT_ALTERA,
            trunc(sysdate) as COI_DT_MINIMA,
            'N' as COI_BO_GERACONTRATO,
            null as MVS_ST_REFERENCIA,
            null as COI_ST_MARCA,
            1 as COI_IN_NRAGRUPAMENTO,
            'Integração via ' || rCot.COT_ST_ORIGEM || '' as COI_ST_DESCRICAO,
            'S' as COI_BO_VALIDOPARACOMPRA
          from
            dual
        ) src on (
          tgt.ORG_TAB_IN_CODIGO = src.ORG_TAB_IN_CODIGO
          and tgt.ORG_PAD_IN_CODIGO = src.ORG_PAD_IN_CODIGO
          and tgt.ORG_IN_CODIGO = src.ORG_IN_CODIGO
          and tgt.ORG_TAU_ST_CODIGO = src.ORG_TAU_ST_CODIGO
          and tgt.SER_TAB_IN_CODIGO = src.SER_TAB_IN_CODIGO
          and tgt.SER_IN_SEQUENCIA = src.SER_IN_SEQUENCIA
          and tgt.COT_IN_CODIGO = src.COT_IN_CODIGO
          and tgt.COI_IN_CODIGO = src.COI_IN_CODIGO
          and rCot.COI_CH_FECHADO = 'S'
        )
      when matched then
      update set
        tgt.PRO_TAB_IN_CODIGO = decode(rCot.COI_CH_FECHADO, 'S', src.PRO_TAB_IN_CODIGO, tgt.PRO_TAB_IN_CODIGO),
        tgt.PRO_PAD_IN_CODIGO = decode(rCot.COI_CH_FECHADO, 'S', src.PRO_PAD_IN_CODIGO, tgt.PRO_PAD_IN_CODIGO),
        tgt.PRO_IN_CODIGO = decode(rCot.COI_CH_FECHADO, 'S', src.PRO_IN_CODIGO, tgt.PRO_IN_CODIGO),
        tgt.APL_TAB_IN_CODIGO = decode(rCot.COI_CH_FECHADO, 'S', src.APL_TAB_IN_CODIGO, tgt.APL_TAB_IN_CODIGO),
        tgt.APL_PAD_IN_CODIGO = decode(rCot.COI_CH_FECHADO, 'S', src.APL_PAD_IN_CODIGO, tgt.APL_PAD_IN_CODIGO),
        tgt.APL_IN_CODIGO = decode(rCot.COI_CH_FECHADO, 'S', src.APL_IN_CODIGO, tgt.APL_IN_CODIGO),
        tgt.TPC_TAB_IN_CODIGO = decode(rCot.COI_CH_FECHADO, 'S', src.TPC_TAB_IN_CODIGO, tgt.TPC_TAB_IN_CODIGO),
        tgt.TPC_PAD_IN_CODIGO = decode(rCot.COI_CH_FECHADO, 'S', src.TPC_PAD_IN_CODIGO, tgt.TPC_PAD_IN_CODIGO),
        tgt.TPC_ST_CLASSE = decode(rCot.COI_CH_FECHADO, 'S', src.TPC_ST_CLASSE, tgt.TPC_ST_CLASSE),
        tgt.COS_IN_CODIGO = decode(rCot.COI_CH_FECHADO, 'S', src.COS_IN_CODIGO, tgt.COS_IN_CODIGO),
        tgt.COI_RE_QTDSUGERIDA = decode(rCot.COI_CH_FECHADO, 'S', src.COI_RE_QTDSUGERIDA, tgt.COI_RE_QTDSUGERIDA),
        tgt.COI_RE_QTDMINIMA = decode(rCot.COI_CH_FECHADO, 'S', src.COI_RE_QTDMINIMA, tgt.COI_RE_QTDMINIMA),
        tgt.COI_ST_ENCERRADO = decode(rCot.COI_CH_FECHADO, 'S', src.COI_ST_ENCERRADO, tgt.COI_ST_ENCERRADO),
        tgt.COI_DT_INCLUSAO = decode(rCot.COI_CH_FECHADO, 'S', src.COI_DT_INCLUSAO, tgt.COI_DT_INCLUSAO),
        tgt.COI_DT_ALTERA = decode(rCot.COI_CH_FECHADO, 'S', src.COI_DT_ALTERA, tgt.COI_DT_ALTERA),
        tgt.COI_DT_MINIMA = decode(rCot.COI_CH_FECHADO, 'S', src.COI_DT_MINIMA, tgt.COI_DT_MINIMA),
        tgt.COI_BO_GERACONTRATO = decode(rCot.COI_CH_FECHADO, 'S', src.COI_BO_GERACONTRATO, tgt.COI_BO_GERACONTRATO),
        tgt.MVS_ST_REFERENCIA = decode(rCot.COI_CH_FECHADO, 'S', src.MVS_ST_REFERENCIA, tgt.MVS_ST_REFERENCIA),
        tgt.COI_ST_MARCA = decode(rCot.COI_CH_FECHADO, 'S', src.COI_ST_MARCA, tgt.COI_ST_MARCA),
        tgt.COI_IN_NRAGRUPAMENTO = decode(rCot.COI_CH_FECHADO, 'S', src.COI_IN_NRAGRUPAMENTO, tgt.COI_IN_NRAGRUPAMENTO),
        tgt.COI_ST_DESCRICAO = decode(rCot.COI_CH_FECHADO, 'S', src.COI_ST_DESCRICAO, tgt.COI_ST_DESCRICAO),
        tgt.COI_BO_VALIDOPARACOMPRA = decode(
          rCot.COI_CH_FECHADO,
          'S',
          src.COI_BO_VALIDOPARACOMPRA,
          tgt.COI_BO_VALIDOPARACOMPRA
        )
      when not matched then
      insert
        (
          ORG_TAB_IN_CODIGO,
          ORG_PAD_IN_CODIGO,
          ORG_IN_CODIGO,
          ORG_TAU_ST_CODIGO,
          SER_TAB_IN_CODIGO,
          SER_IN_SEQUENCIA,
          COT_IN_CODIGO,
          COI_IN_CODIGO,
          PRO_TAB_IN_CODIGO,
          PRO_PAD_IN_CODIGO,
          PRO_IN_CODIGO,
          APL_TAB_IN_CODIGO,
          APL_PAD_IN_CODIGO,
          APL_IN_CODIGO,
          TPC_TAB_IN_CODIGO,
          TPC_PAD_IN_CODIGO,
          TPC_ST_CLASSE,
          COS_IN_CODIGO,
          COI_RE_QTDSUGERIDA,
          COI_RE_QTDMINIMA,
          COI_ST_ENCERRADO,
          COI_DT_INCLUSAO,
          COI_DT_ALTERA,
          COI_DT_MINIMA,
          COI_BO_GERACONTRATO,
          MVS_ST_REFERENCIA,
          COI_ST_MARCA,
          COI_IN_NRAGRUPAMENTO,
          COI_ST_DESCRICAO,
          COI_BO_VALIDOPARACOMPRA
        )
      values
        (
          src.ORG_TAB_IN_CODIGO,
          src.ORG_PAD_IN_CODIGO,
          src.ORG_IN_CODIGO,
          src.ORG_TAU_ST_CODIGO,
          src.SER_TAB_IN_CODIGO,
          src.SER_IN_SEQUENCIA,
          src.COT_IN_CODIGO,
          src.COI_IN_CODIGO,
          src.PRO_TAB_IN_CODIGO,
          src.PRO_PAD_IN_CODIGO,
          src.PRO_IN_CODIGO,
          src.APL_TAB_IN_CODIGO,
          src.APL_PAD_IN_CODIGO,
          src.APL_IN_CODIGO,
          src.TPC_TAB_IN_CODIGO,
          src.TPC_PAD_IN_CODIGO,
          src.TPC_ST_CLASSE,
          src.COS_IN_CODIGO,
          src.COI_RE_QTDSUGERIDA,
          src.COI_RE_QTDMINIMA,
          src.COI_ST_ENCERRADO,
          src.COI_DT_INCLUSAO,
          src.COI_DT_ALTERA,
          src.COI_DT_MINIMA,
          src.COI_BO_GERACONTRATO,
          src.MVS_ST_REFERENCIA,
          src.COI_ST_MARCA,
          src.COI_IN_NRAGRUPAMENTO,
          src.COI_ST_DESCRICAO,
          src.COI_BO_VALIDOPARACOMPRA
        )
      ;

      -- INSERE NA TABELA OS VALORES PRATICADOS PELO FORNECEDOR
      insert into
        EST_ITENSCOTPRECO (
          ORG_TAB_IN_CODIGO,
          ORG_PAD_IN_CODIGO,
          ORG_IN_CODIGO,
          ORG_TAU_ST_CODIGO,
          SER_TAB_IN_CODIGO,
          SER_IN_SEQUENCIA,
          COT_IN_CODIGO,
          COI_IN_CODIGO,
          AGN_TAB_IN_CODIGO,
          AGN_PAD_IN_CODIGO,
          AGN_IN_CODIGO,
          AGN_TAU_ST_CODIGO,
          COP_IN_COLETA,
          MAR_IN_CODIGO,
          PRO_TAB_IN_CODIGO,
          PRO_PAD_IN_CODIGO,
          PRO_IN_CODIGO,
          UNI_TAB_IN_CODIGO,
          UNI_PAD_IN_CODIGO,
          UNI_ST_UNIDADE,
          FMT_TAB_IN_CODIGO,
          FMT_PAD_IN_CODIGO,
          FMT_ST_CODIGO,
          COF_RE_QUANTIDADE,
          COF_RE_QTDEATENDIDA,
          COF_RE_VLUNIVISTA,
          COF_RE_VLUNIPRAZO,
          COF_RE_VLVISTACONV,
          COF_RE_VLPRAZOCONV,
          COF_RE_VLCUSTU,
          COF_RE_VLMERCADORIA,
          COF_RE_PEDESC,
          COF_RE_VLDESC,
          COF_RE_VLDESCGERAL,
          COF_RE_PEACRE,
          COF_RE_VLACRE,
          COF_RE_VLACREGERAL,
          COF_BO_DESTACADO,
          COF_RE_VLMOBRAP,
          COF_RE_VLFRETE,
          COF_RE_VLSEGURO,
          COF_RE_VLDESPESA,
          COF_RE_PERCIPI,
          COF_RE_VLIPI,
          COF_RE_VLBASEIPI,
          COF_RE_VLISENIPI,
          COF_RE_VLOUTRIPI,
          COF_RE_IPIRECUPERA,
          COF_RE_PERCICM,
          COF_RE_VLICMS,
          COF_RE_VLBASEICM,
          COF_RE_VLISENICM,
          COF_RE_VLOUTRICM,
          COF_RE_VLICMRETIDO,
          COF_RE_ICMRECUPERA,
          COF_RE_PERDIFICMS,
          COF_RE_VALDIFICMS,
          COF_RE_BASESUBTRIB,
          COF_RE_PERISS,
          COF_RE_VLBASEISS,
          COF_RE_VLISS,
          COF_RE_VLBASEIRRF,
          COF_RE_PERIRRF,
          COF_RE_VLIRRF,
          COF_RE_VLBASEINSS,
          COF_RE_PERINSS,
          COF_RE_VLINSS,
          COF_RE_VLVOLUME,
          COF_RE_VLUNILIQUIDO,
          COF_RE_VALORPVV,
          COF_RE_VLTOTAL,
          COF_ST_MARCA,
          COF_ST_EMBALAGEM,
          COF_ST_PEDIDO,
          COF_ST_FECHADO,
          COF_CH_EMAIL,
          COF_RE_COTACAOMOE,
          COF_RE_VALORMOEDA,
          COF_RE_VLICMRETIDOANT,
          COF_RE_BASESUBTRIBANT,
          COF_RE_VLPISRETIDO,
          COF_RE_VLPISRECUPERA,
          COF_RE_PERCPIS,
          COF_RE_VLPIS,
          COF_RE_VLBASEPIS,
          COF_RE_VLCOFINSRETIDO,
          COF_RE_VLCOFINSRECUPERA,
          COF_RE_PERCCOFINS,
          COF_RE_VLCOFINS,
          COF_RE_VLBASECOFINS,
          COF_RE_PERCSLL,
          COF_RE_VLBASECSLL,
          COF_RE_VLCSLL,
          COSM_IN_CODIGO,
          COF_BO_ENCERRADO,
          APL_CH_DESTINACAO,
          COF_IN_DIASENTREGA,
          COF_ST_OBSERVACAOWEB,
          COF_ST_OBSERVACAO,
          COF_CH_DEFIPI,
          COF_RE_PAUTAIPI,
          APL_TAB_IN_CODIGO,
          APL_PAD_IN_CODIGO,
          APL_IN_CODIGO,
          COF_RE_VLBASEISSDEVIDO,
          COF_RE_PERISSDEVIDO,
          COF_RE_VLISSDEVIDO,
          COF_BO_SERAFORNECIDO,
          COF_ST_HASH
        )
      values
        (
          rCot.ORG_TAB_IN_CODIGO, -- ORG_TAB_IN_CODIGO
          rCot.ORG_PAD_IN_CODIGO, -- ORG_PAD_IN_CODIGO
          rCot.ORG_IN_CODIGO, -- ORG_IN_CODIGO
          rCot.ORG_TAU_ST_CODIGO, -- ORG_TAU_ST_CODIGO
          110, -- SER_TAB_IN_CODIGO
          rCot.SER_IN_SEQUENCIA, -- SER_IN_SEQUENCIA
          vCOT_IN_CODIGO, -- COT_IN_CODIGO
          rCot.SOI_IN_CODIGO, -- COI_IN_CODIGO
          53, -- AGN_TAB_IN_CODIGO
          rCot.PRO_PAD_IN_CODIGO, -- AGN_PAD_IN_CODIGO
          rCot.FOR_IN_CODIGO, -- AGN_IN_CODIGO
          'F', -- AGN_TAU_ST_CODIGO
          1, --1 ou 0 COP_IN_COLETA
          null, -- MAR_IN_CODIGO
          100, -- PRO_TAB_IN_CODIGO
          rCot.PRO_PAD_IN_CODIGO, -- PRO_PAD_IN_CODIGO
          rCot.PRO_IN_CODIGO, -- PRO_IN_CODIGO
          103, -- uni_tab_in_codigo -- UNI_TAB_IN_CODIGO
          rCot.PRO_PAD_IN_CODIGO, -- UNI_PAD_IN_CODIGO
          rCot.UNI_ST_UNIDADE, -- UNI_ST_UNIDADE
          rCot.FMT_TAB_IN_CODIGO, -- FMT_TAB_IN_CODIGO
          rCot.FMT_PAD_IN_CODIGO, -- FMT_PAD_IN_CODIGO
          rCot.FMT_ST_CODIGO, -- FMT_ST_CODIGO
          rCot.COI_RE_QUANTIDADE, -- COF_RE_QUANTIDADE
          rCot.COI_RE_QUANTIDADE, -- COF_RE_QTDEATENDIDA
          rCot.COI_RE_VALORUNITARIO, -- COF_RE_VLUNIVISTA
          rCot.COI_RE_VALORUNITARIO, -- COF_RE_VLUNIPRAZO
          rCot.COI_RE_VALORUNITARIO, -- COF_RE_VLVISTACONV
          rCot.COI_RE_VALORUNITARIO, -- COF_RE_VLPRAZOCONV
          rCot.COI_RE_VALORUNITARIO, -- COF_RE_VLCUSTU
          rCot.COI_RE_VALORUNITARIO, -- COF_RE_VLMERCADORIA
          0, -- COF_RE_PEDESC
          0, -- COF_RE_VLDESC
          0, -- COF_RE_VLDESCGERAL
          0, -- COF_RE_PEACRE
          0, -- COF_RE_VLACRE
          rCot.COI_RE_VALORUNITARIO, -- COF_RE_VLACREGERAL
          'N', -- COF_BO_DESTACADO
          0, -- COF_RE_VLMOBRAP
          0, -- COF_RE_VLFRETE
          0, -- COF_RE_VLSEGURO
          0, -- COF_RE_VLDESPESA
          0, -- COF_RE_PERCIPI
          0, -- COF_RE_VLIPI
          0, -- COF_RE_VLBASEIPI
          0, -- COF_RE_VLISENIPI
          0, -- COF_RE_VLOUTRIPI
          0, -- COF_RE_IPIRECUPERA
          0, -- COF_RE_PERCICM
          0, -- COF_RE_VLICMS
          0, -- COF_RE_VLBASEICM
          0, -- COF_RE_VLISENICM
          0, -- COF_RE_VLOUTRICM
          0, -- COF_RE_VLICMRETIDO
          0, -- COF_RE_ICMRECUPERA
          0, -- COF_RE_PERDIFICMS
          0, -- COF_RE_VALDIFICMS
          0, -- COF_RE_BASESUBTRIB
          0, -- COF_RE_PERISS
          0, -- COF_RE_VLBASEISS
          0, -- COF_RE_VLISS
          0, -- COF_RE_VLBASEIRRF
          0, -- COF_RE_PERIRRF
          0, -- COF_RE_VLIRRF
          0, -- COF_RE_VLBASEINSS
          0, -- COF_RE_PERINSS
          0, -- COF_RE_VLINSS
          null, -- COF_RE_VLVOLUME
          rCot.COI_RE_VALORUNITARIO * rCot.COI_RE_QUANTIDADE, -- COF_RE_VLUNILIQUIDO
          rCot.COI_RE_VALORUNITARIO * rCot.COI_RE_QUANTIDADE, -- COF_RE_VALORPVV
          rCot.COI_RE_VALORUNITARIO * rCot.COI_RE_QUANTIDADE, -- COF_RE_VLTOTAL
          null, -- COF_ST_MARCA
          null, -- COF_ST_EMBALAGEM
          'N', -- COF_ST_PEDIDO
          rCot.COI_CH_FECHADO, -- COF_ST_FECHADO
          'N', -- COF_CH_EMAIL
          null, -- COF_RE_COTACAOMOE
          rCot.COI_RE_VALORUNITARIO, -- COF_RE_VALORMOEDA
          0, -- COF_RE_VLICMRETIDOANT
          0, -- COF_RE_BASESUBTRIBANT
          0, -- COF_RE_VLPISRETIDO
          0, -- COF_RE_VLPISRECUPERA
          0, -- COF_RE_PERCPIS
          0, -- COF_RE_VLPIS
          0, -- COF_RE_VLBASEPIS
          0, -- COF_RE_VLCOFINSRETIDO
          0, -- COF_RE_VLCOFINSRECUPERA
          0, -- COF_RE_PERCCOFINS
          0, -- COF_RE_VLCOFINS
          0, -- COF_RE_VLBASECOFINS
          0, -- COF_RE_PERCSLL
          0, -- COF_RE_VLBASECSLL
          0, -- COF_RE_VLCSLL
          0, -- COSM_IN_CODIGO
          'N', -- COF_BO_ENCERRADO
          null, -- APL_CH_DESTINACAO
          0, -- COF_IN_DIASENTREGA
          null, -- COF_ST_OBSERVACAOWEB
          null, -- COF_ST_OBSERVACAO
          'N', -- COF_CH_DEFIPI
          0, -- COF_RE_PAUTAIPI
          rCot.APL_TAB_IN_CODIGO, -- APL_TAB_IN_CODIGO
          rCot.APL_PAD_IN_CODIGO, -- APL_PAD_IN_CODIGO
          rCot.APL_IN_CODIGO, -- APL_IN_CODIGO
          0, -- COF_RE_VLBASEISSDEVIDO
          0, -- COF_RE_PERISSDEVIDO
          0, -- COF_RE_VLISSDEVIDO
          'S', -- COF_BO_SERAFORNECIDO
          null -- COF_ST_HASH
        )
      ;

      if (rCot.COI_CH_FECHADO = 'S') then
        select
          nvl(max(cfs.CFS_IN_SEQUENCIAL), 0) + 1
        into
          vCFS_IN_SEQUENCIAL
        from
          EST_COTAFILIALSOLIC cfs
        where
          cfs.ORG_TAB_IN_CODIGO = rCot.ORG_TAB_IN_CODIGO
          and cfs.ORG_PAD_IN_CODIGO = rCot.ORG_PAD_IN_CODIGO
          and cfs.ORG_IN_CODIGO = rCot.ORG_IN_CODIGO
          and cfs.ORG_TAU_ST_CODIGO = rCot.ORG_TAU_ST_CODIGO
          and cfs.SER_TAB_IN_CODIGO = rCot.SER_TAB_IN_CODIGO
          and cfs.SER_IN_SEQUENCIA = rCot.SER_IN_SEQUENCIA
          and cfs.COT_IN_CODIGO = vCOT_IN_CODIGO
          and cfs.COI_IN_CODIGO = rCot.SOI_IN_CODIGO
        ;

        insert into
          EST_COTAFILIALSOLIC (
            CFS_IN_SEQUENCIAL,
            SER_TAB_IN_CODIGO,
            SER_IN_SEQUENCIA,
            COT_IN_CODIGO,
            COI_IN_CODIGO,
            ORG_TAB_IN_CODIGO,
            ORG_PAD_IN_CODIGO,
            ORG_IN_CODIGO,
            ORG_TAU_ST_CODIGO,
            ORG_TAB_IN_CODIGOSOL,
            ORG_PAD_IN_CODIGOSOL,
            ORG_IN_CODIGOSOL,
            ORG_TAU_ST_CODIGOSOL,
            FIL_IN_CODIGO,
            AGN_TAB_IN_CODIGO,
            AGN_PAD_IN_CODIGO,
            AGN_IN_CODIGO,
            AGN_TAU_ST_CODIGO,
            CFS_RE_QUANTIDADE,
            CFS_RE_QTDEATENDIDA,
            CFS_RE_VLMERCADORIA,
            CFS_RE_VLTOTAL,
            CFS_RE_VLUNILIQUIDO,
            CFS_RE_VLCUSTU,
            CFS_RE_PEDESC,
            CFS_RE_VLDESC,
            CFS_RE_VLDESCGERAL,
            CFS_RE_PEACRE,
            CFS_RE_VLACRE,
            CFS_RE_VLACREGERAL,
            CFS_RE_VLMOBRAP,
            CFS_RE_VLFRETE,
            CFS_RE_VLSEGURO,
            CFS_RE_VLDESPESA,
            CFS_IN_DIASENTREGA,
            CFS_RE_PERCIPI,
            CFS_RE_VLIPI,
            CFS_RE_VLBASEIPI,
            CFS_RE_VLISENIPI,
            CFS_RE_VLOUTRIPI,
            CFS_RE_IPIRECUPERA,
            CFS_RE_PERCICMS,
            CFS_RE_VLICMS,
            CFS_RE_VLBASEICMS,
            CFS_RE_VLISENICMS,
            CFS_RE_VLOUTRICMS,
            CFS_RE_ICMSRECUPERA,
            CFS_RE_PERISS,
            CFS_RE_VLISS,
            CFS_RE_VLBASEISS,
            CFS_RE_PERIRRF,
            CFS_RE_VLIRRF,
            CFS_RE_VLBASEIRRF,
            CFS_RE_PERINSS,
            CFS_RE_VLINSS,
            CFS_RE_VLBASEINSS,
            CFS_RE_PERCPIS,
            CFS_RE_VLPIS,
            CFS_RE_VLBASEPIS,
            CFS_RE_VLPISRECUPERA,
            CFS_RE_VLPISRETIDO,
            CFS_RE_PERCCOFINS,
            CFS_RE_VLCOFINS,
            CFS_RE_VLBASECOFINS,
            CFS_RE_VLCOFINSRECUPERA,
            CFS_RE_VLCOFINSRETIDO,
            CFS_RE_PERCSLL,
            CFS_RE_VLCSLL,
            CFS_RE_VLBASECSLL,
            CFS_RE_VALORPVV,
            CFS_RE_VLICMSRETIDO,
            CFS_RE_VLICMSRETIDOANT,
            CFS_RE_BASESUBTRIBANT,
            CFS_RE_BASESUBTRIB,
            CFS_RE_PERDIFICMS,
            CFS_RE_VALDIFICMS,
            CFS_CH_ORIGEM,
            CFS_CH_DEFIPI,
            CFS_RE_PAUTAIPI,
            APL_TAB_IN_CODIGO,
            APL_PAD_IN_CODIGO,
            APL_IN_CODIGO,
            CFS_RE_VLBASEISSDEVIDO,
            CFS_RE_PERISSDEVIDO,
            CFS_RE_VLISSDEVIDO
          )
        values
          (
            vCFS_IN_SEQUENCIAL, -- CFS_IN_SEQUENCIAL
            110, -- SER_TAB_IN_CODIGO
            rCot.SER_IN_SEQUENCIA, -- SER_IN_SEQUENCIA
            vCOT_IN_CODIGO, -- COT_IN_CODIGO
            rCot.SOI_IN_CODIGO, -- COI_IN_CODIGO
            rCot.ORG_TAB_IN_CODIGO, -- ORG_TAB_IN_CODIGO
            rCot.ORG_PAD_IN_CODIGO, -- ORG_PAD_IN_CODIGO
            rCot.ORG_IN_CODIGO, -- ORG_IN_CODIGO
            rCot.ORG_TAU_ST_CODIGO, -- ORG_TAU_ST_CODIGO
            rCot.ORG_TAB_IN_CODIGO, -- ORG_TAB_IN_CODIGOSOL
            rCot.ORG_PAD_IN_CODIGO, -- ORG_PAD_IN_CODIGOSOL
            rCot.ORG_IN_CODIGO, -- ORG_IN_CODIGOSOL
            rCot.ORG_TAU_ST_CODIGO, -- ORG_TAU_ST_CODIGOSOL
            rCot.FIL_IN_CODIGO, -- FIL_IN_CODIGO
            53, -- AGN_TAB_IN_CODIGO
            rCot.PRO_PAD_IN_CODIGO, -- AGN_PAD_IN_CODIGO
            rCot.FOR_IN_CODIGO, -- AGN_IN_CODIGO
            'F', -- AGN_TAU_ST_CODIGO
            nvl(rCot.COI_RE_QUANTIDADE, 0), -- CFS_RE_QUANTIDADE
            nvl(rCot.COI_RE_QUANTIDADE, 0), -- CFS_RE_QTDEATENDIDA
            nvl(rCot.COI_RE_VALORUNITARIO, 0), -- CFS_RE_VLMERCADORIA
            nvl(rCot.COI_RE_VALORUNITARIO * rCot.COI_RE_QUANTIDADE, 0), -- CFS_RE_VLTOTAL
            nvl(rCot.COI_RE_VALORUNITARIO, 0), -- CFS_RE_VLUNILIQUIDO
            nvl(rCot.COI_RE_VALORUNITARIO, 0), -- CFS_RE_VLCUSTU
            0, -- CFS_RE_PEDESC
            0, -- CFS_RE_VLDESC
            0, -- CFS_RE_VLDESCGERAL
            0, -- CFS_RE_PEACRE
            0, -- CFS_RE_VLACRE
            0, -- CFS_RE_VLACREGERAL
            0, -- CFS_RE_VLMOBRAP
            0, -- CFS_RE_VLFRETE
            0, -- CFS_RE_VLSEGURO
            nvl(rCot.COI_RE_VALORUNITARIO, 0), -- CFS_RE_VLDESPESA
            0, -- CFS_IN_DIASENTREGA
            0, -- CFS_RE_PERCIPI
            0, -- CFS_RE_VLIPI
            0, -- CFS_RE_VLBASEIPI
            0, -- CFS_RE_VLISENIPI
            0, -- CFS_RE_VLOUTRIPI
            0, -- CFS_RE_IPIRECUPERA
            0, -- CFS_RE_PERCICMS
            0, -- CFS_RE_VLICMS
            0, -- CFS_RE_VLBASEICMS
            0, -- CFS_RE_VLISENICMS
            0, -- CFS_RE_VLOUTRICMS
            0, -- CFS_RE_ICMSRECUPERA
            0, -- CFS_RE_PERISS
            0, -- CFS_RE_VLISS
            0, -- CFS_RE_VLBASEISS
            0, -- CFS_RE_PERIRRF
            0, -- CFS_RE_VLIRRF
            0, -- CFS_RE_VLBASEIRRF
            0, -- CFS_RE_PERINSS
            0, -- CFS_RE_VLINSS
            0, -- CFS_RE_VLBASEINSS
            0, -- CFS_RE_PERCPIS
            0, -- CFS_RE_VLPIS
            0, -- CFS_RE_VLBASEPIS
            0, -- CFS_RE_VLPISRECUPERA
            0, -- CFS_RE_VLPISRETIDO
            0, -- CFS_RE_PERCCOFINS
            0, -- CFS_RE_VLCOFINS
            0, -- CFS_RE_VLBASECOFINS
            0, -- CFS_RE_VLCOFINSRECUPERA
            0, -- CFS_RE_VLCOFINSRETIDO
            0, -- CFS_RE_PERCSLL
            0, -- CFS_RE_VLCSLL
            0, -- CFS_RE_VLBASECSLL
            rCot.COI_RE_VALORUNITARIO, -- CFS_RE_VALORPVV
            0, -- CFS_RE_VLICMSRETIDO
            0, -- CFS_RE_VLICMSRETIDOANT
            0, -- CFS_RE_BASESUBTRIBANT
            0, -- CFS_RE_BASESUBTRIB
            0, -- CFS_RE_PERDIFICMS
            0, -- CFS_RE_VALDIFICMS
            'S', -- CFS_CH_ORIGEM
            null, -- CFS_CH_DEFIPI
            null, -- CFS_RE_PAUTAIPI
            rCot.APL_TAB_IN_CODIGO, -- APL_TAB_IN_CODIGO
            rCot.APL_PAD_IN_CODIGO, -- APL_PAD_IN_CODIGO
            rCot.APL_IN_CODIGO, -- APL_IN_CODIGO
            0, --CFS_RE_VLBASEISSDEVIDO -- CFS_RE_VLBASEISSDEVIDO
            0, --CFS_RE_PERISSDEVIDO -- CFS_RE_PERISSDEVIDO
            0 --CFS_RE_VLISSDEVIDO -- CFS_RE_VLISSDEVIDO
          )
        ;

        -- CRIA O VÍNCULO ENTRE OS ITENS DA COTAÇÃO E OO ITENS DA SOLICITAÇÃO
        update EST_ITENSSOLI
        set
          COT_ORG_TAB_IN_CODIGO = rCot.ORG_TAB_IN_CODIGO,
          COT_ORG_PAD_IN_CODIGO = rCot.ORG_PAD_IN_CODIGO,
          COT_ORG_IN_CODIGO = rCot.ORG_IN_CODIGO,
          COT_ORG_TAU_ST_CODIGO = rCot.ORG_TAU_ST_CODIGO,
          COT_SER_TAB_IN_CODIGO = 110,
          COT_SER_IN_SEQUENCIA = rCot.SER_IN_SEQUENCIA,
          COT_IN_CODIGO = vCOT_IN_CODIGO,
          COI_IN_CODIGO = rCot.SOI_IN_CODIGO,
          SOI_CH_STATUS = 'A'
        where
          ORG_TAB_IN_CODIGO = rCot.ORG_TAB_IN_CODIGO
          and ORG_PAD_IN_CODIGO = rCot.ORG_PAD_IN_CODIGO
          and ORG_IN_CODIGO = rCot.ORG_IN_CODIGO
          and ORG_TAU_ST_CODIGO = rCot.ORG_TAU_ST_CODIGO
          and SER_TAB_IN_CODIGO = rCot.SER_TAB_IN_CODIGO
          and SER_IN_SEQUENCIA = rCot.SER_IN_SEQUENCIA
          and SOL_IN_CODIGO = rCot.SOL_IN_CODIGO
          and SOI_IN_CODIGO = rCot.SOI_IN_CODIGO
        ;
      end if;
    end loop;

    if (vCOT_IN_CODIGO is null) then
      raise_application_error(-20000, 'Falha ao gerar cotação');
    end if;

    update TJS_COTACAO
    set
      COT_IN_CODIGO = vCOT_IN_CODIGO
    where
      COT_ST_ORIGEM = pCOT_ST_ORIGEM
      and COT_ST_ID = pCOT_ST_ID
    ;

  END P_GERACOTACAO;

  procedure P_CANCELAPEDIDO(
    pORG_TAB_IN_CODIGO EST_PEDCOMPRAS.ORG_TAB_IN_CODIGO%type,
    pORG_PAD_IN_CODIGO EST_PEDCOMPRAS.ORG_PAD_IN_CODIGO%type,
    pORG_IN_CODIGO EST_PEDCOMPRAS.ORG_IN_CODIGO%type,
    pORG_TAU_ST_CODIGO EST_PEDCOMPRAS.ORG_TAU_ST_CODIGO%type,
    pSER_TAB_IN_CODIGO EST_PEDCOMPRAS.SER_TAB_IN_CODIGO%type,
    pSER_IN_SEQUENCIA EST_PEDCOMPRAS.SER_IN_SEQUENCIA%type,
    pPDC_IN_CODIGO EST_PEDCOMPRAS.PDC_IN_CODIGO%type
  ) is
    pCURSOR sys_refcursor;
    vNOMESERVIDOR GLO_FILIAL_ATIVA.COMP_ST_NOME%type;
    vCONTEXT DBMS_XMLGEN.CTXHANDLE;
    vXML clob;
    vRETORNO clob;
    vERRO varchar(600);
    vMENSAGEM varchar2(600);
    vCOUNTRECEBS number;
    -- vTRANSACAO number;
    -- vPK varchar2(50);
    vWS_ST_HOSTINTEGRADOR TJS_PARAMETROS.WS_ST_HOSTINTEGRADOR%type;
    vWS_IN_PORTINTEGRADOR TJS_PARAMETROS.WS_IN_PORTINTEGRADOR%type;
  begin
    begin
      select
        rpm.WS_ST_HOSTINTEGRADOR,
        rpm.WS_IN_PORTINTEGRADOR
      into
        vWS_ST_HOSTINTEGRADOR,
        vWS_IN_PORTINTEGRADOR
      from
        TJS_PARAMETROS rpm
      where
        rownum = 1
      ;
    exception when others then
      raise_application_error(-20000, 'Parametros do Integrador não foram Encontrados!');
    end;

    begin
      select
        sub.COUNTRECEBS
      into
        vCOUNTRECEBS
      from
        (
          select
            count(1) as COUNTRECEBS
          from
            EST_PEDIDOSRECEB pdr
          where
            pdr.ORG_TAB_IN_CODIGO = pORG_TAB_IN_CODIGO
            and pdr.ORG_PAD_IN_CODIGO = pORG_PAD_IN_CODIGO
            and pdr.ORG_IN_CODIGO = pORG_IN_CODIGO
            and pdr.ORG_TAU_ST_CODIGO = pORG_TAU_ST_CODIGO
            and pdr.SER_TAB_IN_CODIGO = pSER_TAB_IN_CODIGO
            and pdr.SER_IN_SEQUENCIA = pSER_IN_SEQUENCIA
            and pdr.PDC_IN_CODIGO = pPDC_IN_CODIGO
        ) sub
      where
        sub.COUNTRECEBS = 0
      ;
    exception when others then
      raise_application_error(-20000, 'Pedido não pode ser cancelado pois possui recebimento registrado.');
    end;

    for rRow in (
      select
        cot.ORG_TAB_IN_CODIGO,
        cot.ORG_PAD_IN_CODIGO,
        cot.ORG_IN_CODIGO,
        cot.ORG_TAU_ST_CODIGO,
        cot.SER_TAB_IN_CODIGO,
        cot.SER_IN_SEQUENCIA,
        cot.COT_IN_CODIGO,
        soi.SOL_IN_CODIGO,
        cop.PDC_IN_CODIGO
      from
        EST_COTACOES cot
        inner join EST_COTAPEDIDO cop on (
          cop.COT_ORG_TAB_IN_CODIGO = cot.ORG_TAB_IN_CODIGO
          and cop.COT_ORG_PAD_IN_CODIGO = cot.ORG_PAD_IN_CODIGO
          and cop.COT_ORG_IN_CODIGO = cot.ORG_IN_CODIGO
          and cop.COT_ORG_TAU_ST_CODIGO = cot.ORG_TAU_ST_CODIGO
          and cop.COT_SER_TAB_IN_CODIGO = cot.SER_TAB_IN_CODIGO
          and cop.COT_SER_IN_SEQUENCIA = cot.SER_IN_SEQUENCIA
          and cop.COT_IN_CODIGO = cot.COT_IN_CODIGO
        )
        inner join EST_ITENSSOLI soi on (
          soi.COT_ORG_TAB_IN_CODIGO = cop.COT_ORG_TAB_IN_CODIGO
          and soi.COT_ORG_PAD_IN_CODIGO = cop.COT_ORG_PAD_IN_CODIGO
          and soi.COT_ORG_IN_CODIGO = cop.COT_ORG_IN_CODIGO
          and soi.COT_ORG_TAU_ST_CODIGO = cop.COT_ORG_TAU_ST_CODIGO
          and soi.COT_SER_TAB_IN_CODIGO = cop.COT_SER_TAB_IN_CODIGO
          and soi.COT_SER_IN_SEQUENCIA = cop.COT_SER_IN_SEQUENCIA
          and soi.COT_IN_CODIGO = cop.COT_IN_CODIGO
          and soi.COI_IN_CODIGO = cop.COI_IN_CODIGO
        )
      where
        cop.ORG_TAB_IN_CODIGO = pORG_TAB_IN_CODIGO
        and cop.ORG_PAD_IN_CODIGO = pORG_PAD_IN_CODIGO
        and cop.ORG_IN_CODIGO = pORG_IN_CODIGO
        and cop.ORG_TAU_ST_CODIGO = pORG_TAU_ST_CODIGO
        and cop.PDC_SER_TAB_IN_CODIGO = pSER_TAB_IN_CODIGO
        and cop.PDC_SER_IN_SEQUENCIA = pSER_IN_SEQUENCIA
        and cop.PDC_IN_CODIGO = pPDC_IN_CODIGO
    ) loop
      -- Limpa as tabelas da Cotação
      delete EST_COTAPEDIDO
      where
        ORG_TAB_IN_CODIGO = rRow.ORG_TAB_IN_CODIGO
        and ORG_PAD_IN_CODIGO = rRow.ORG_PAD_IN_CODIGO
        and ORG_IN_CODIGO = rRow.ORG_IN_CODIGO
        and ORG_TAU_ST_CODIGO = rRow.ORG_TAU_ST_CODIGO
        and COT_IN_CODIGO = rRow.COT_IN_CODIGO
        and PDC_IN_CODIGO = rRow.PDC_IN_CODIGO
      ;

      delete EST_SOLICPEDIDO
      where
        ORG_TAB_IN_CODIGO = rRow.ORG_TAB_IN_CODIGO
        and ORG_PAD_IN_CODIGO = rRow.ORG_PAD_IN_CODIGO
        and ORG_IN_CODIGO = rRow.ORG_IN_CODIGO
        and ORG_TAU_ST_CODIGO = rRow.ORG_TAU_ST_CODIGO
        and SOL_IN_CODIGO = rRow.SOL_IN_CODIGO
        and PDC_IN_CODIGO = rRow.PDC_IN_CODIGO
      ;

      -- Limpa Pedidos
      open pCURSOR for
      select
        cursor (
          select
            'D' as OPERACAO,
            cot.FIL_IN_CODIGO as FIL_IN_CODIGO,
            'UN' as SER_ST_CODIGO, -- SER_ST_CODIGO
            rRow.PDC_IN_CODIGO as PDC_IN_CODIGO -- PDC_IN_PROCESSO
          from
            TJS_COTACAO cot
          where
            cot.COT_IN_CODIGO = rRow.COT_IN_CODIGO
        ) "Pedido"
      from
        DUAL
      ;

      -- Atribuir todo o resultado do cursor para a variável vContext que será utilizada para extrair o XML
      vCONTEXT := DBMS_XMLGEN.NEWCONTEXT(pCURSOR);
      vXML := DBMS_XMLGEN.GETXML(vCONTEXT, 0);
      vXML := replace(vXML, '<?xml version="1.0"?>', null);
      vXML := replace(vXML, '<Pedido>', '<Pedido OPERACAO="D">');
      vXML := replace(replace(vXML, '<ROWSET>', null), '</ROWSET>', null);
      vXML := replace(replace(vXML, '<ROW>', null), '</ROW>', null);
      vXML := replace(replace(vXML, '<Pedido_ROW>', null), '</Pedido_ROW>', null);

      begin
        select
          P.PRO_ST_NOMECOMPUTADOR
        into
          vNOMESERVIDOR
        from
          INT_PROCESSO P
        where
          P.PRO_IN_ID = 706
        ;

      exception when no_data_found then
        raise_application_error(
          -20001,
          'É necessário que o nome do servidor que irá processar a integração esteja configurada no serviço 706'
        );
      end;

      vRETORNO := INT_PCK_UTIL.F_PROCESSATRANSACAO(
        vWS_ST_HOSTINTEGRADOR, --Servidor
        vWS_IN_PORTINTEGRADOR, --porta
        706, --servico
        1, --usuario
        1, --sistema
        'Cancelamento de Pedido de Compras', --cmplemento
        vXML, --xml
        null,
        1000
      );

      vERRO := substr(
        vRETORNO,
        instr(vRETORNO, '<v1:Erro>') + length('<v1:Erro>'),
        instr(vRETORNO, '</v1:Erro>') - instr(vRETORNO, '<v1:Erro>') - length('<v1:Erro>')
      );
      vMENSAGEM := substr(
        vRETORNO,
        instr(vRETORNO, '<v1:Mensagem>') + length('<v1:Mensagem>'),
        instr(vRETORNO, '</v1:Mensagem>') - instr(vRETORNO, '<v1:Mensagem>') - length('<v1:Mensagem>')
      );
      -- vPK := substr(
      --   vRETORNO,
      --   instr(vRETORNO, '<v1:PKMega>') + length('<v1:PKMega>'),
      --   instr(vRETORNO, '</v1:PKMega>') - instr(vRETORNO, '<v1:PKMega>') - length('<v1:PKMega>')
      -- );
      -- vTRANSACAO := to_number(
      --   substr(
      --     vRETORNO,
      --     instr(vRETORNO, '<v1:CodTransacao>') + length('<v1:CodTransacao>'),
      --     instr(vRETORNO, '</v1:CodTransacao>') - instr(vRETORNO, '<v1:CodTransacao>') - length('<v1:CodTransacao>')
      --   )
      -- );

      if (upper(vERRO) = 'TRUE') then
        raise_application_error(-20000, vMENSAGEM);
      end if;

      delete from EST_COTAFILIALSOLIC
      where
        ORG_TAB_IN_CODIGO = rRow.ORG_TAB_IN_CODIGO
        and ORG_PAD_IN_CODIGO = rRow.ORG_PAD_IN_CODIGO
        and ORG_IN_CODIGO = rRow.ORG_IN_CODIGO
        and ORG_TAU_ST_CODIGO = rRow.ORG_TAU_ST_CODIGO
        and SER_TAB_IN_CODIGO = rRow.SER_TAB_IN_CODIGO
        and SER_IN_SEQUENCIA = rRow.SER_IN_SEQUENCIA
        and COT_IN_CODIGO = rRow.COT_IN_CODIGO
      ;

      delete from EST_ITENSCOTPRECO
      where
        ORG_TAB_IN_CODIGO = rRow.ORG_TAB_IN_CODIGO
        and ORG_PAD_IN_CODIGO = rRow.ORG_PAD_IN_CODIGO
        and ORG_IN_CODIGO = rRow.ORG_IN_CODIGO
        and ORG_TAU_ST_CODIGO = rRow.ORG_TAU_ST_CODIGO
        and SER_TAB_IN_CODIGO = rRow.SER_TAB_IN_CODIGO
        and SER_IN_SEQUENCIA = rRow.SER_IN_SEQUENCIA
        and COT_IN_CODIGO = rRow.COT_IN_CODIGO
      ;

      update EST_ITENSSOLI
      set
        COT_ORG_TAB_IN_CODIGO = null,
        COT_ORG_PAD_IN_CODIGO = null,
        COT_ORG_IN_CODIGO = null,
        COT_ORG_TAU_ST_CODIGO = null,
        COT_SER_TAB_IN_CODIGO = null,
        COT_SER_IN_SEQUENCIA = null,
        COT_IN_CODIGO = null,
        COI_IN_CODIGO = null
      where
        COT_ORG_TAB_IN_CODIGO = rRow.ORG_TAB_IN_CODIGO
        and COT_ORG_PAD_IN_CODIGO = rRow.ORG_PAD_IN_CODIGO
        and COT_ORG_IN_CODIGO = rRow.ORG_IN_CODIGO
        and COT_ORG_TAU_ST_CODIGO = rRow.ORG_TAU_ST_CODIGO
        and COT_SER_TAB_IN_CODIGO = rRow.SER_TAB_IN_CODIGO
        and COT_SER_IN_SEQUENCIA = rRow.SER_IN_SEQUENCIA
        and COT_IN_CODIGO = rRow.COT_IN_CODIGO
      ;

      delete from EST_ITENSCOTA
      where
        ORG_TAB_IN_CODIGO = rRow.ORG_TAB_IN_CODIGO
        and ORG_PAD_IN_CODIGO = rRow.ORG_PAD_IN_CODIGO
        and ORG_IN_CODIGO = rRow.ORG_IN_CODIGO
        and ORG_TAU_ST_CODIGO = rRow.ORG_TAU_ST_CODIGO
        and SER_TAB_IN_CODIGO = rRow.SER_TAB_IN_CODIGO
        and SER_IN_SEQUENCIA = rRow.SER_IN_SEQUENCIA
        and COT_IN_CODIGO = rRow.COT_IN_CODIGO
      ;

      delete from EST_ITENSCOTFOR
      where
        ORG_TAB_IN_CODIGO = rRow.ORG_TAB_IN_CODIGO
        and ORG_PAD_IN_CODIGO = rRow.ORG_PAD_IN_CODIGO
        and ORG_IN_CODIGO = rRow.ORG_IN_CODIGO
        and ORG_TAU_ST_CODIGO = rRow.ORG_TAU_ST_CODIGO
        and SER_TAB_IN_CODIGO = rRow.SER_TAB_IN_CODIGO
        and SER_IN_SEQUENCIA = rRow.SER_IN_SEQUENCIA
        and COT_IN_CODIGO = rRow.COT_IN_CODIGO
      ;

      delete from EST_COTACAOOCOR
      where
        ORG_TAB_IN_CODIGO = rRow.ORG_TAB_IN_CODIGO
        and ORG_PAD_IN_CODIGO = rRow.ORG_PAD_IN_CODIGO
        and ORG_IN_CODIGO = rRow.ORG_IN_CODIGO
        and ORG_TAU_ST_CODIGO = rRow.ORG_TAU_ST_CODIGO
        and SER_TAB_IN_CODIGO = rRow.SER_TAB_IN_CODIGO
        and SER_IN_SEQUENCIA = rRow.SER_IN_SEQUENCIA
        and COT_IN_CODIGO = rRow.COT_IN_CODIGO
      ;

      delete from EST_COTACOES
      where
        ORG_TAB_IN_CODIGO = rRow.ORG_TAB_IN_CODIGO
        and ORG_PAD_IN_CODIGO = rRow.ORG_PAD_IN_CODIGO
        and ORG_IN_CODIGO = rRow.ORG_IN_CODIGO
        and ORG_TAU_ST_CODIGO = rRow.ORG_TAU_ST_CODIGO
        and SER_TAB_IN_CODIGO = rRow.SER_TAB_IN_CODIGO
        and SER_IN_SEQUENCIA = rRow.SER_IN_SEQUENCIA
        and COT_IN_CODIGO = rRow.COT_IN_CODIGO
      ;

      update TJS_COTACAO
      set
        COT_IN_CODIGO = null
      where
        COT_IN_CODIGO = rRow.COT_IN_CODIGO
      ;
    end loop;

  end P_CANCELAPEDIDO;

END TJS_PCK_INTEGRACAO;
