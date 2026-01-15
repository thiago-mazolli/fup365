import AppError from './AppError';

const validaParametroBoolean = (parametro: string, paramName: string) => {
  if (!['S', 'N'].includes(parametro.toUpperCase())) {
    throw new AppError({
      statusCode: 400,
      header: 'Parâmetros inválido!',
      error: {
        message: `Parâmetro "${paramName}" deve receber 'S' ou 'N'!`,
      },
    });
  }
};

export default validaParametroBoolean;
