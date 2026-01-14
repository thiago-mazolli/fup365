create or replace trigger TJS_T_ESTPEDCOMPRAS
  after insert or update or delete on EST_PEDCOMPRAS
  for each row
declare
  vEVENTODESC TJS_NOTIFICMOD.NFD_ST_EVENTODESC%type;
begin
  if ((DELETING) or (:new.PDC_ST_SITUACAO in ('PC', 'PR', 'PE'))) then
    vEVENTODESC := 'pedido_cancelado';
  elsif (INSERTING) then
    vEVENTODESC := 'pedido_criado';
  elsif (UPDATING) then
    vEVENTODESC := 'pedido_alterado';
  end if;

  TJS_PCK_INTEGRACAO.P_CRIA_NOTIFIC(
    'EST_PEDCOMPRAS',
    (
      nvl(:old.ORG_TAB_IN_CODIGO, :new.ORG_TAB_IN_CODIGO) || ';' ||
      nvl(:old.ORG_PAD_IN_CODIGO, :new.ORG_PAD_IN_CODIGO) || ';' ||
      nvl(:old.ORG_IN_CODIGO, :new.ORG_IN_CODIGO) || ';' ||
      nvl(:old.ORG_TAU_ST_CODIGO, :new.ORG_TAU_ST_CODIGO) || ';' ||
      nvl(:old.SER_TAB_IN_CODIGO, :new.SER_TAB_IN_CODIGO) || ';' ||
      nvl(:old.SER_IN_SEQUENCIA, :new.SER_IN_SEQUENCIA) || ';' ||
      nvl(:old.PDC_IN_CODIGO, :new.PDC_IN_CODIGO)
    ),
    '/webhooks/pedidos',
    vEVENTODESC
  );
end;
