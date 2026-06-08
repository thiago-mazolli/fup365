--TABELAS
select t.*, rowid from TJS_AGENTE t;

--VIEW
select t.* from TJS_VW_INTEGRACAO t;

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

select t.*,
       rowid
  from TJS_INTEGRACAOMOD t
 where t.MOD_DT_DATAMOD < '01/06/2026';

select t.*,
       rowid
  from TJS_INTEGRACAOLOG t
 where exists (select 1
                 from TJS_INTEGRACAOMOD m
                where m.MOD_ST_TBLMEGA = t.MOD_ST_TBLMEGA
                  and m.MOD_ST_PKMEGA = t.MOD_ST_PKMEGA
                  and t.MOD_DT_DATAMOD < '01/06/2026');
