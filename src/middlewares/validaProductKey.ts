import { Request, Response, NextFunction } from 'express';
import { AppError, IHeaderProps } from 'dev4-code-library';
import apiLicense from '../services/apiLicense';

const validaProductKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productkey }: IHeaderProps = req.headers as any;

  if (!productkey) {
    return res
      .status(404)
      .send({ error: 'A Chave do Produto não foi fornecida!' });
  }

  try {
    const {
      data: { isValid, message },
    } = await apiLicense.get('/check', {
      headers: { key: productkey, hostname: req.originalUrl },
    });
    if (isValid === false) {
      throw new AppError({
        statusCode: 406,
        header: 'Chave inválida',
        error: {
          message,
        },
      });
    }
  } catch (error) {
    // Verifica se o erro tem uma resposta e tenta desestruturar
    if ((error as any).response) {
      const { isValid, message } = (error as any).response.data || {};

      if (isValid === false) {
        throw new AppError({
          statusCode: 406,
          header: 'Chave inválida',
          error: {
            message: message || 'Erro de validação desconhecido.',
          },
        });
      }
    }

    throw new AppError({
      statusCode: 500,
      header: 'Erro interno',
      error,
    });
  }

  return next();
};

export default validaProductKey;
