--TABELAS
select t.*, rowid from TJS_AGENTE t;

--LOGS
select t.*, rowid from TJS_INTEGRACAOMOD t;
select t.*, rowid from TJS_INTEGRACAOLOG t;
select t.*, rowid from TJS_LOGS t; --TJS_S_LOGID;

--TRIGGER
TJS_T_ESTPEDCOMPRAS;
TJS_T_ESTPEDIDOSRECEB;

--PCK
TJS_PCK_INTEGRACAO;
TJS_PCK_LOGS;