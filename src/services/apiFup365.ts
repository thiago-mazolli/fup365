import axios, { AxiosInstance } from 'axios';
import { hostHomolog, hostpProduct, login, password } from '../config';

// const baseURL = `${hostpProduct}/api/authentication`;
const baseURL = `${hostHomolog}/api/authentication`;

const authURL = `${baseURL}/api/authentication`;

const apiFup365: AxiosInstance = axios.create({
  baseURL,
});

apiFup365.interceptors.request.use(async config => {
  config.maxContentLength = Infinity;
  config.maxBodyLength = Infinity;

  try {
    const respToken = await axios.request({
      method: 'POST',
      url: authURL,
      headers: { 'Content-Type': 'application/json' },
      data: {
        login,
        password,
      },
    });

    const { token } = respToken.data;

    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log('getToken error', error);

    throw new Error(
      `Erro ao requisitar o token. ${(error as any).response.status} - ${
        (error as any).response.statusText
      }`
    );
  }

  return config;
});

export default apiFup365;
