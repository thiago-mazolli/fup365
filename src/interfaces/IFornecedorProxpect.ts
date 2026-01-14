export interface IFornecedorProxpect {
  /** Código do fornecedor no MEGA */
  codigoFornecedor: number;
  /** Razão Social */
  razaoSocial: string;
  /** CNPJ do fornecedor */
  cnpj: string;
  /** E-mail principal cadastrado */
  email: string | null;
  /** Data da última atualização */
  dataAtualizacao: string | Date | null;
  /** Listagem de contatos */
  contatos: {
    tipo: string;
    contato: string;
  }[];
}
