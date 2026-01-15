create or replace package body TJS_PCK_INTEGRACAO is

  procedure P_CRIA_INTEGRACAO(
    pMOD_ST_TBLMEGA in TJS_INTEGRACAOMOD.MOD_ST_TBLMEGA%type,
    pMOD_ST_PKMEGA  in TJS_INTEGRACAOMOD.MOD_ST_PKMEGA%type
  ) is
    vMetodo varchar2(10);
  begin
    merge into
      TJS_INTEGRACAOMOD tgt using (
        select
          pMOD_ST_TBLMEGA as MOD_ST_TBLMEGA,
          pMOD_ST_PKMEGA as MOD_ST_PKMEGA,
          sysdate as MOD_DT_DATAMOD,
          (sysdate - 1) as MOD_DT_DATAENV
        from
          dual
      ) src on (
        tgt.MOD_ST_TBLMEGA = src.MOD_ST_TBLMEGA
        and tgt.MOD_ST_PKMEGA = src.MOD_ST_PKMEGA
      )
    when matched then
    update set
      tgt.MOD_DT_DATAMOD = src.MOD_DT_DATAMOD
    when not matched then
    insert
      (
        MOD_ST_TBLMEGA,
        MOD_ST_PKMEGA,
        MOD_DT_DATAMOD,
        MOD_DT_DATAENV
      )
    values
      (
        src.MOD_ST_TBLMEGA,
        src.MOD_ST_PKMEGA,
        src.MOD_DT_DATAMOD,
        src.MOD_DT_DATAENV
      )
    ;

  end P_CRIA_INTEGRACAO;

END TJS_PCK_INTEGRACAO;
