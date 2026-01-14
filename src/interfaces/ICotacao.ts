interface ICotacao {
  filial: number;
  codigoCotacao: string;
  fornecedores: IFornecedor[];
}

interface IFornecedor {
  fornecedor: number;
  valorTotal: number;
  vencedora: boolean;
  itens: ICotacaoItem[];
}
interface ICotacaoItem {
  codigoProduto: number;
  quantidade: number;
  valorUnitario: number;
  solicitacao: ICotacaoItemSolicitacao[];
}

interface ICotacaoItemSolicitacao {
  codigoSolicitacao: number;
  seqItemSoli: number;
}

export default ICotacao;
