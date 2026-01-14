export interface IUsuarioProxpect {
  /** Código do usuário */
  codigoUsuario: number;
  /** Nome completo do usuário */
  name: string;
  /** E-mail cadastrado */
  email: string | null;
  /** Código do Grupo do produto (chave) */
  codGrupo: number;
  /** Grupo do produto (chave) */
  grupo: string;
}
