select a.*, rowid from glo_agentes a where a.agn_in_codigo = 502;
select a.*, rowid from glo_agentes_id a where a.agn_tau_st_codigo = 'F';

select a.*, rowid from glo_grupo_usuario a where a.gru_in_codigo = 1;

SELECT t.*, ROWID FROM TJS_agente t;
TJS_t_agente;
TJS_t_glo_agentes;

SELECT t.*, ROWID FROM TJS_usuario t;
TJS_t_usuario;
TJS_t_glo_grupo_usuario;

SELECT t.*, ROWID FROM TJS_produto t;
TJS_t_produto;
TJS_t_est_produtos;

SELECT t.*, ROWID FROM TJS_INTEGRACAOCFG t;
SELECT t.*, ROWID FROM TJS_INTEGRACAOMOD t;
SELECT t.*, ROWID FROM TJS_integracaolog t;

SELECT t.* FROM TJS_vw_agentes t;

TJS_s_logid;
SELECT t.*, ROWID FROM TJS_logs t;

TJS_PCK_INTEGRACAO;
TJS_pck_logs;
