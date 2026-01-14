interface IPedidoAP {
  codigoTitulo: number;
  codigoPedido: string;
  valorDocumento: number;
  parcelas: IPedidoAPParcela[];
}

interface IPedidoAPParcela {
  codigoParcela: string;
  dataVencimento: string | Date;
  dataVencProrrogado: string | Date;
  valor: number;
  valorEmAberto: number;
  status: 'Pago' | 'Em Aberto';
  dataPagamento: string | Date;
}

export default IPedidoAP;
