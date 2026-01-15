create or replace package body TJS_PCK_INTEGRACAO is

  procedure P_CRIA_INTEGRACAO(
    pNFD_ST_TBLMEGA in TJS_INTEGRACAOMOD.NFD_ST_TBLMEGA%type,
    pNFD_ST_PKMEGA  in TJS_INTEGRACAOMOD.NFD_ST_PKMEGA%type
  ) is
    vMetodo varchar2(10);
  begin
    merge into
      TJS_INTEGRACAOMOD tgt using (
        select
          pNFD_ST_TBLMEGA as NFD_ST_TBLMEGA,
          pNFD_ST_PKMEGA as NFD_ST_PKMEGA,
          sysdate as NFD_DT_DATAMOD,
          (sysdate - 1) as NFD_DT_DATAENV
        from
          dual
      ) src on (
        tgt.NFD_ST_TBLMEGA = src.NFD_ST_TBLMEGA
        and tgt.NFD_ST_PKMEGA = src.NFD_ST_PKMEGA
      )
    when matched then
    update set
      tgt.NFD_DT_DATAMOD = src.NFD_DT_DATAMOD
    when not matched then
    insert
      (
        NFD_ST_TBLMEGA,
        NFD_ST_PKMEGA,
        NFD_DT_DATAMOD,
        NFD_DT_DATAENV
      )
    values
      (
        src.NFD_ST_TBLMEGA,
        src.NFD_ST_PKMEGA,
        src.NFD_DT_DATAMOD,
        src.NFD_DT_DATAENV
      )
    ;

  end P_CRIA_INTEGRACAO;

END TJS_PCK_INTEGRACAO;
