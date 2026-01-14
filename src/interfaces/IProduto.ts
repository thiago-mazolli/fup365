export interface IProduto {
  /** Código do item no cadastro de produtos */
  codigoProduto: number;
  /** Código do produto (supplierProductId) */
  supplierProductId: string;
  /** Descrição do produto */
  descricao: string;
  description: string;
  /** Complemento ou descrição alternativa */
  complement?: string | null;
  /** Unidade de medida do produto */
  unidade: string;
  measurementUnit: string;
  /** Observação ou narrativa do produto */
  note?: string | null;
  /** Preço estimado (valor fixo 0 na query) */
  estimatedPrice: number;
  /** Código do Grupo do produto (chave) */
  codGrupo: number;
  /** Grupo do produto (chave) */
  grupo: string;
  clientGroupId: string;
  /** Descrição do grupo do produto (não retornado na query) */
  clientGroupDescription?: string | null;
  /** Indica se é serviço, valor derivado de isServiceChar */
  isServiceChar?: 'S' | 'N';
  isService: boolean;
  /** Indica se é genérico, valor derivado de isGenericChar */
  isGenericChar?: 'S' | 'N';
  isGeneric?: boolean;
  /** Indica se o produto está ativo (true/false equivalente ao decode de “ativo”) */
  ativoChar?: 'S' | 'N';
  ativo?: boolean;
  /** Status do produto: Active ou Blocked */
  status?: 'Active' | 'Blocked';
  /** Código alternativo do produto (não retornado, mas mantido para compatibilidade) */
  supplierReferenceProductId?: string | null;
  /** Origem do material (não retornado na query) */
  materialOrigin?: string | null;
  /** Tipo de aplicação (não retornado na query) */
  applicationType?: string | null;
  /** Categoria do material (não retornado na query) */
  materialCategory?: string | null;
  /** Fabricantes do produto (não retornado na query) */
  manufacturers?: string[] | null;
  /** Código de identificação do produto (não retornado) */
  productIdentificationCode?: string | null;
  /** Organizações de negócio associadas (não retornado) */
  businessOrganizations?: string[] | null;
  /** Categorias (não retornado) */
  categories?: string[] | null;
  /** Atributos adicionais (não retornado) */
  attributes?: Record<string, any> | null;
}
