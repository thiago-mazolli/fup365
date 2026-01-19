create or replace trigger TJS_T_ESTPEDCOMPRAS
  after insert or update or delete on EST_PEDCOMPRAS
  for each row
declare
  vMOD_ST_TBLMEGA TJS_INTEGRACAOMOD.MOD_ST_TBLMEGA%type;
  vINTEGRAFUP     number;
begin
  begin
    select decode(count(1), 0, 0, 1)
      into vINTEGRAFUP
      from TJS_AGENTE a
     where a.AGN_TAB_IN_CODIGO = nvl(:new.AGN_TAB_IN_CODIGO, :old.AGN_TAB_IN_CODIGO)
       and a.AGN_PAD_IN_CODIGO = nvl(:new.AGN_PAD_IN_CODIGO, :old.AGN_PAD_IN_CODIGO)
       and a.AGN_IN_CODIGO = nvl(:new.AGN_IN_CODIGO, :old.AGN_IN_CODIGO)
       and a.AGN_CH_INTEGRAFUP = 'S';
  exception
    when others then
      vINTEGRAFUP := 0;
  end;

  if vINTEGRAFUP = 1 then
    if ((DELETING) or (:new.PDC_ST_SITUACAO in ('PC', 'PR', 'PE'))) then
      vMOD_ST_TBLMEGA := 'EST_PEDCOMPRAS_CANC';
    else
      vMOD_ST_TBLMEGA := 'EST_PEDCOMPRAS';
    end if;

    TJS_PCK_INTEGRACAO.P_CRIA_INTEGRACAO(
      vMOD_ST_TBLMEGA,
      (
        nvl(:old.ORG_TAB_IN_CODIGO, :new.ORG_TAB_IN_CODIGO) || ';' ||
        nvl(:old.ORG_PAD_IN_CODIGO, :new.ORG_PAD_IN_CODIGO) || ';' ||
        nvl(:old.ORG_IN_CODIGO, :new.ORG_IN_CODIGO) || ';' ||
        nvl(:old.ORG_TAU_ST_CODIGO, :new.ORG_TAU_ST_CODIGO) || ';' ||
        nvl(:old.SER_TAB_IN_CODIGO, :new.SER_TAB_IN_CODIGO) || ';' ||
        nvl(:old.SER_IN_SEQUENCIA, :new.SER_IN_SEQUENCIA) || ';' ||
        nvl(:old.PDC_IN_CODIGO, :new.PDC_IN_CODIGO)
      )
    );
  end if;
end TJS_T_ESTPEDCOMPRAS;
