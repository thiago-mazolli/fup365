create or replace trigger TJS_T_ESTPEDIDOSRECEB
  after insert on EST_PEDIDOSRECEB
  for each row
declare
  vINTEGRAFUP number;
begin
  begin
    select decode(count(1), 0, 0, 1)
      into vINTEGRAFUP
      from TJS_AGENTE a
      join EST_PEDCOMPRAS p on p.AGN_TAB_IN_CODIGO = a.AGN_TAB_IN_CODIGO
                           and p.AGN_PAD_IN_CODIGO = a.AGN_PAD_IN_CODIGO
                           and p.AGN_IN_CODIGO = a.AGN_IN_CODIGO
     where p.ORG_TAB_IN_CODIGO = nvl(:new.ORG_TAB_IN_CODIGO, :old.ORG_TAB_IN_CODIGO)
       and p.ORG_PAD_IN_CODIGO = nvl(:new.ORG_PAD_IN_CODIGO, :old.ORG_PAD_IN_CODIGO)
       and p.ORG_IN_CODIGO = nvl(:new.ORG_IN_CODIGO, :old.ORG_IN_CODIGO)
       and p.ORG_TAU_ST_CODIGO = nvl(:new.ORG_TAU_ST_CODIGO, :old.ORG_TAU_ST_CODIGO)
       and p.SER_TAB_IN_CODIGO = nvl(:new.SER_TAB_IN_CODIGO, :old.SER_TAB_IN_CODIGO)
       and p.SER_IN_SEQUENCIA = nvl(:new.SER_IN_SEQUENCIA, :old.SER_IN_SEQUENCIA)
       and p.PDC_IN_CODIGO = nvl(:new.PDC_IN_CODIGO, :old.PDC_IN_CODIGO)
       and a.AGN_CH_INTEGRAFUP = 'S';
  exception
    when others then
      vINTEGRAFUP := 0;
  end;

  if vINTEGRAFUP = 1 then
    TJS_PCK_INTEGRACAO.P_CRIA_INTEGRACAO(
      'EST_PEDIDOSRECEB',
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
end TJS_T_ESTPEDIDOSRECEB;