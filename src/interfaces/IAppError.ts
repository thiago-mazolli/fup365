interface IAppError {
  error: any;
  logId?: string;
  header?: string;
  script?: string;
  params?: object;
  permUpdate?: string;
  intServico?: string;
  intStatus?: string;
  intXML?: string;
  intMsgErro?: string;
  intPkMega?: string;
  intCodTransacao?: string;
  campoAdic1?: string;
  campoAdic2?: string;
  campoAdic3?: string;
  campoAdic4?: string;
  campoAdic5?: string;
  statusCode?: number;
}

export default IAppError;
