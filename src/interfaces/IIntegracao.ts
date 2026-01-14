interface IIntegracao {
  tblMega: string;
  pkMega: string;
  dataModificacao: string; // date
  dataEnvio: string; // date
  metodo: string;
  host: string;
  path: string;
  authKey: string;
  authMetodo: string;
  authHost: string;
  authPath: string;
  idMe: string;
}

export default IIntegracao;
