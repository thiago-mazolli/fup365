export const porta = 44315;
export const hostLocal = `http://localhost:${porta}`;
export const hostProduct = 'https://grupoolhodagua.fup365.com.br';
export const login = 'api_fup365_grupoolhodagua';
export const password = 'x2.6PqQ6pRYCf4s';
export const authorization =
  'Basic 768344fb21a1de2b6740d1b6a0a8853fff9a8e0e8d481c7c171655a5b686';
export const taskPedido = '0 */5 * * * *'; // 5 em 5 minutos
export const taskPedidoCanc = '0 */5 * * * *'; // 5 em 5 minutos
export const taskRecebimento = '0 */5 * * * *'; // 5 em 5 minutos

export default {
  porta,
  hostLocal,
  hostProduct,
  login,
  password,
  taskPedido,
  taskPedidoCanc,
  taskRecebimento,
};
