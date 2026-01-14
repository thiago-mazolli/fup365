create or replace trigger TJS_T_ESTPEDIDOSRECEB
  after insert or update or delete on EST_PEDIDOSRECEB
  for each row
declare
begin
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
    '/webhooks/recebimentos',
    'recebimento_registrado'
  );
end;
