import { AppError } from 'dev4-code-library';

const validaParametro = (parametro: any, paramName: string) => {
  if (!parametro) {
    throw new AppError({
      statusCode: 400,
      header: 'Parâmetros insuficientes!',
      error: {
        message: `Parâmetro "${paramName}" não localizado!`,
      },
    });
  }
};

export default validaParametro;
