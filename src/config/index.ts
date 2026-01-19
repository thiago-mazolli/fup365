export const porta = 17010;
export const hostLocal = `http://localhost:${porta}`;
export const hostProduct = 'https://grupoolhodagua.fup365.com.br';
export const hostHomolog = 'https://testeonline.fup365.com.br';
export const login = 'api_fup365_grupoolhodagua';
export const password = 'x2.6PqQ6pRYCf4s';
export const taskPedido = '0 */2 * * * *'; // 2 em 2 minutos
export const taskPedidoCanc = '0 */2 * * * *'; // 2 em 2 minutos
export const taskRecebimento = '0 */2 * * * *'; // 2 em 2 minutos

export default {
  porta,
  hostLocal,
  hostProduct,
  hostHomolog,
  login,
  password,
  taskPedido,
  taskPedidoCanc,
  taskRecebimento,
};
