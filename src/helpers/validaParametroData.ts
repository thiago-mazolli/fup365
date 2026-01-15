import AppError from './AppError';
import validaDataString from './validaDataString';

const validaParametroData = (data: any, paramName: string) => {
  const message = `A ${paramName} deve ser uma string no formato "dd-mm-yyyy"!`;

  if (typeof data !== 'string') {
    throw new AppError({
      statusCode: 400,
      header: 'Data deve ser uma string!',
      error: {
        message,
      },
    });
  }

  if (validaDataString(data) === false) {
    throw new AppError({
      statusCode: 400,
      header: `${paramName} inválida!`,
      error: {
        message,
      },
    });
  }
};

export default validaParametroData;
