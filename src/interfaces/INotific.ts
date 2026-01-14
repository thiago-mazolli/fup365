interface INotific {
  tblMega: string;
  pkMega: string;
  dataModificacao: string | Date;
  dataEnvio: string | Date;
  webhookMetodo: string;
  webhookHost: string;
  webhookPath: string;
  authKey: string;
  authMetodo: string;
  authHost: string;
  authPath: string;
  evento: string;
}

export default INotific;
