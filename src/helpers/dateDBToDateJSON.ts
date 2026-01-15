const dateDBToDateJSON = (data: string | number | Date, emptyValue = '') => {
  return data ? new Date(data) : emptyValue;
};

export default dateDBToDateJSON;
