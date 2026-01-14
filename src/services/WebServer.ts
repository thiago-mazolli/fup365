import axios, { AxiosInstance } from 'axios';
import { consoleLog } from 'dev4-code-library';

class WebServer {
  public api: AxiosInstance;

  constructor(
    host: string,
    auth?: {
      host: string;
      metodo: string;
      path: string;
      key: string;
    }
  ) {
    this.api = axios.create({
      baseURL: host,
    });

    this.api.interceptors.request.use(async config => {
      config.maxContentLength = Infinity;
      config.maxBodyLength = Infinity;

      if (auth) {
        try {
          const respToken = await axios.request({
            method: auth.metodo,
            url: `${auth.host}/${auth.path}`,
            headers: { 'Content-Type': 'application/json' },
            data: {
              clientId: auth.key.split(';')[0],
              clientSecret: auth.key.split(';')[1],
            },
          });

          const { accessToken } = respToken.data;

          if (config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        } catch (error) {
          consoleLog('getToken error', error);

          throw new Error(
            `Erro ao requisitar o token. ${(error as any).response.status} - ${
              (error as any).response.statusText
            }`
          );
        }
      }

      return config;
    });
  }
}

export default WebServer;
