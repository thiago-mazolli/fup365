const validaDataString = (data: string): boolean => {
  // Regex para validar o formato dd-mm-yyyy
  const padrao = /^\d{2}-\d{2}-\d{4}$/;

  if (!padrao.test(data)) {
    return false;
  }

  const [dia, mes, ano] = data.split('-').map(Number);

  // Verifica se o ano é bissexto
  const isBissexto = (ano: number) => {
    return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
  };

  // Validação de dias por mês
  const diasPorMes = [
    31,
    isBissexto(ano) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  // Verifica se o mês está dentro do intervalo
  if (mes < 1 || mes > 12) {
    return false;
  }

  // Verifica se o dia está dentro do intervalo para o mês correspondente
  if (dia < 1 || dia > diasPorMes[mes - 1]) {
    return false;
  }

  return true;
};

export default validaDataString;
