interface IPedidoReceb {
  codigoPedido: string;
  itens: IPedidoRecebItem[];
}

interface IPedidoRecebItem {
  codigoProduto: number;
  dataRecebimento: string | Date;
  quantidadeRecebida: number;
}

export default IPedidoReceb;
