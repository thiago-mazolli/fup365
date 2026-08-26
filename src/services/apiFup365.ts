import axios, { AxiosInstance } from 'axios';
import { hostProduct, login, password, authorization } from '../config';

const baseURL = `${hostProduct}`;

const authURL = `${baseURL}/api/authentication`;

const apiFup365: AxiosInstance = axios.create({
  baseURL,
});

apiFup365.interceptors.request.use(async config => {
  config.maxContentLength = Infinity;
  config.maxBodyLength = Infinity;

  try {
    // console.log('interceptors buscando token');
    const respToken = await axios.request({
      method: 'POST',
      url: authURL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      data: {
        login,
        password,
      },
    });
    // console.log('respToken.data:', respToken.data);

    const { data: token } = respToken.data;

    // console.log('token:', token);

    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // console.log('getToken error', error);

    throw new Error(
      `Erro ao requisitar o token. ${(error as any).response.status} - ${
        (error as any).response.statusText
      }`
    );
  }

  return config;
});

export default apiFup365;
