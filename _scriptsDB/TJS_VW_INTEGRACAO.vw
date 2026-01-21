CREATE OR REPLACE VIEW TJS_VW_INTEGRACAO AS
SELECT m.mod_st_tblmega || ';' || m.mod_st_pkmega mod_st_chave,
       m.mod_st_tblmega,
       m.mod_st_pkmega,
       m.mod_dt_datamod,
       m.mod_dt_dataenv,
       tjs_pck_integracao.f_status_integracao(m.mod_st_tblmega, m.mod_st_pkmega) log_ch_status_atual,
       tjs_pck_integracao.f_status_integracao(m.mod_st_tblmega, m.mod_st_pkmega, 'D') log_st_status_atual,
       tjs_pck_integracao.f_status_integracao(m.mod_st_tblmega, m.mod_st_pkmega, 'M') log_st_status_atual_mensagem,
       tjs_pck_integracao.f_status_integracao(m.mod_st_tblmega, m.mod_st_pkmega, 'T') log_dt_status_atual,
       ped.pdc_in_codigo,
       ped.ser_st_codigo,
       agn.agn_in_codigo,
       agn.agn_st_nome,
       ped.fil_in_codigo,
       fil.agn_st_fantasia fil_st_fantasia
  FROM tjs_integracaomod m
  JOIN est_pedcompras ped ON (ped.org_tab_in_codigo || ';' ||
                              ped.org_pad_in_codigo || ';' ||
                              ped.org_in_codigo || ';' ||
                              ped.org_tau_st_codigo || ';' ||
                              ped.ser_tab_in_codigo || ';' ||
                              ped.ser_in_sequencia || ';' ||
                              ped.pdc_in_codigo) = m.mod_st_pkmega
  JOIN glo_vw_todosagentes agn ON agn.agn_tab_in_codigo = ped.agn_tab_in_codigo
                              AND agn.agn_pad_in_codigo = ped.agn_pad_in_codigo
                              AND agn.agn_in_codigo = ped.agn_in_codigo
                              AND agn.agn_tau_st_codigo = ped.agn_tau_st_codigo
  JOIN glo_agentes fil ON fil.agn_tab_in_codigo = ped.org_tab_in_codigo
                      AND fil.agn_pad_in_codigo = ped.org_pad_in_codigo
                      AND fil.agn_in_codigo = ped.fil_in_codigo;
