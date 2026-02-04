import { Request, Response, NextFunction } from 'express';
import formataErro from '../helpers/formataErro';
import AppError from '../helpers/AppError';

const logErrors = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    const { statusCode, header, message } = err;
    console.log('Erro interno:', err);
    return res
      .status(statusCode || 500)
      .send(formataErro(statusCode, header, message));
  }

  if (err.code === 'ERR_BAD_RESPONSE') {
    const { response } = err;
    const { status, data } = response;
    const { error } = data;
    const { cod, header, message } = error;
    const { script, params }: any = req.body;

    const msgError: any = undefined;
    if (script) {
      msgError.message = message;
      msgError.script = script;
    }
    if (params) {
      msgError.message = message;
      msgError.script = params;
    }

    console.log('Erro em requisição interna:', err.response.data);
    return res
      .status(status || 500)
      .send(formataErro(cod, header, msgError || message));
  }

  console.log('Erro interno sem tratamento:', err);
  return res
    .status(500)
    .send(formataErro(500, 'Erro Interno', 'Erro interno sem tratamento'));
};

export default logErrors;
