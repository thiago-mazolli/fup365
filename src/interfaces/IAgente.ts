export interface IAgente {
  /** Código do fornecedor no MEGA */
  codigoFornecedor: number;
  clientSupplierId: number;

  /** Razão Social */
  razaoSocial: string;
  companyName: string;

  /** CNPJ do fornecedor */
  cnpj: string;
  document_number: string;

  /** E-mail principal cadastrado */
  email: string | null;

  /** Data da última atualização */
  dataAtualizacao: string | Date | null;

  /** Listagem de contatos */
  contatos: {
    tipo: string;
    contato: string;
  }[];

  /** Dados exclusivos para integração com o ME */
  tradingName: string | null;
  document_type: 'CPF' | 'CNPJ';
  contact: string | null;
  phoneNumber: string | null;

  /** Endereço */
  address: string | null;
  addressNumber: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;

  /** Inscrição estadual */
  stateRegistrationNumber: string | null;

  /** Outros campos administrativos */
  languageId: number;
  isDeactivatedChar: string;
  paymentCondition: string | null;
  attributes: any | null;
  homologationStatus: string | null;
  groups: any | null;

  /** Dados de criação */
  createdByName: string;
  createdByEmail: string | null;

  /** Contas bancárias */
  accounts: {
    CAID_BAN_IN_NUMERO: number | string;
    CAIDAGE_ST_NUMERO: string | null;
    CAIDAGE_ST_NUMERO_DIG: string | null;
    CAID_ST_CONTACORR: string | null;
    CAID_ST_CONTACORR_DIG: string | null;
    CAID_ST_TITULAR: string | null;
    CAID_BO_INATIVA: string | number | null;
  }[];

  /** E-mails adicionais */
  additionalEmails: {
    email: string | null;
  }[];
}
