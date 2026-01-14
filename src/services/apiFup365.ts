import WebServer from './WebServer';

const apiProxpect = (
  host: string,
  auth?: {
    host: string;
    metodo: string;
    path: string;
    key: string;
  }
) => {
  return new WebServer(host, auth).api;
};

export default apiProxpect;
