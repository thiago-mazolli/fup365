export interface ISolicitacao {
  /** Código da Filial */
  codigoFilial: number;

  /** Identificador único da solicitação */
  codigoSolicitacao: number;

  /** Data de geração da solicitação */
  dataCriacao: string | Date; // formato de data ISO (ex: "2025-11-05T10:30:00Z")

  /** Data de última alteração (usada para busca incremental) */
  dataAlteracao?: string | Date | null;

  /** Código e nome do centro de custo */
  centroCusto?: number | null;

  /** Referência ao projeto vinculado */
  projeto?: number | null;

  /** Relação de produtos vinculados à solicitação */
  itens: IItemSolicitacao[];
}

export interface IItemSolicitacao {
  /** Codigo do Usuário criador da solicitação */
  codSolicitante: number;

  /** Usuário criador da solicitação */
  solicitante: string;

  /** Código do item no cadastro de produtos */
  codigoProduto: string;

  /** Sequência do item no cadastro de solicitação */
  seqItemSoli: number;

  /** Especificação do item */
  especificacao: string;

  /** Referência do item da solicitação */
  referencia?: string | null;

  /** Motivo da solicitação do item */
  motivo?: string | null;

  /** Tipo de classe */
  classe?: string | null;

  /** Código da aplicação */
  aplicacao?: number | null;

  /** Descrição do produto */
  descricaoProduto: string;

  /** Quantidade solicitada */
  quantidade: number;

  /** Unidade do item */
  unidade: string;

  /** Código do Grupo do produto (chave) */
  codGrupo: number;

  /** Grupo do produto */
  grupo?: string | null;

  /** Situação textual do item */
  situacao:
    | 'Aprovação Técnica'
    | 'Aprovação Estoque'
    | 'Aprovação Pré-Cotação'
    | 'Aprovação Orçamentária'
    | 'Cancelada'
    | 'Pendente'
    | 'Aberto'
    | 'Baixada';
}
