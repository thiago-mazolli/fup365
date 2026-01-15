const formataInteger = (value: any) => {
  try {
    return parseInt(value, 10) > 0 ? parseInt(value, 10) : null;
  } catch (error) {
    return null;
  }
};

export default formataInteger;
