export interface IUsuario {
  /** Código do usuário */
  codigoUsuario: number;
  /** Nome completo do usuário */
  name: string;
  nome: string;
  /** E-mail cadastrado */
  email: string | null;
  /** Código do Grupo do produto (chave) */
  codGrupo: number;
  /** Grupo do produto (chave) */
  grupo: string;
  /** Login de acesso */
  login: string;
  /** Contato principal (geralmente o mesmo nome) */
  contact: string;
  /** Telefone de contato */
  phone: string | null;
  /** Perfil do usuário */
  profile: string;
  /** Permissões atribuídas */
  permission: string;
  /** Papel/função do usuário */
  role: string;
  /** Tag de integração */
  integrationTag: string;
  /** Indicador de desativação ('S' ou 'N') */
  isDeactivatedChar: string;
  isDeactivated: boolean;
  /** Idioma */
  languageId: number;
  /** Organizações de negócio associadas */
  businessOrganizations: any | null;
  /** Centros de custo associados */
  costCenters: any | null;
  /** Grupos de compra associados */
  purchasingGroups: any | null;
}
