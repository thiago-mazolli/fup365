export interface IProdutoProxpect {
  /** Código do item no cadastro de produtos */
  codigoProduto: number;
  /** Descrição do produto */
  descricao: string;
  /** Unidade de medida do produto */
  unidade: string;
  /** Código do Grupo do produto (chave) */
  codGrupo: number;
  /** Grupo do produto (chave) */
  grupo: string;
  /** Indica se o produto está ativo (true/false equivalente ao decode de “ativo”) */
  ativo: boolean;
}
