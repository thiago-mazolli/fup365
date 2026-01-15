const formataErro = (cod: any, header: any, message: any) => {
  return {
    error: {
      cod,
      header,
      message,
    },
  };
};

export default formataErro;
