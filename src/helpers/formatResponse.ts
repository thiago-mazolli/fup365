export interface Response {
  status: number;
  statusText?: string;
  headers?: any;
  config?: any;
  data?: any;
}

export function formatResponse(responseCompleto: any): Response {
  if (!responseCompleto) return { status: 501 }; // CASO A RESPOSTA SEJA INDEFINIDA

  const resp = { response: responseCompleto }; //

  // FORMATA O ERRO ABSTRAINDO OS CAMPOS ABAIXO DA RESPOSTA
  const {
    response: { status, statusCode, statusText, headers, config, data },
  } = resp;

  const response = {
    status: statusCode || status || 501, // Garante que o status sempre esteja definido
    statusText,
    headers,
    config,
    data,
  };

  return response;
}
