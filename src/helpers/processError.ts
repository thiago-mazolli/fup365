/**
 * Função responsável por processar erros.
 *
 * @param error O erro a ser processado.
 * @returns A mensagem de erro ou 'Erro' caso não seja possível determinar.
 *
 * @example
 * const error = {
 *   response: {
 *     data: {
 *       message: 'Erro na requisição'
 *     }
 *   },
 *   message: 'Erro desconhecido'
 * };
 *
 * const mensagemErro = processError(error);
 * console.log(mensagemErro); // 'Erro na requisição'
 */
const processError = (error: any) => {
  // Verifica se o erro possui uma resposta
  if (error.response) {
    const { data, body } = error.response;

    // Verifica se a resposta possui uma mensagem no corpo
    if (body && body.message) {
      return body.message;
    }

    // Verifica se a resposta possui uma mensagem nos dados
    if (data && data.message) {
      return data.message;
    }

    // Verifica se a resposta possui um erro nos dados
    if (data && data.error) {
      return data.error;
    }
  }

  // Verifica se o erro possui uma mensagem
  if (error.message) {
    return error.message;
  }

  // Caso não seja possível determinar a mensagem de erro, retorna 'Erro'
  return 'Erro';
};

export default processError;
