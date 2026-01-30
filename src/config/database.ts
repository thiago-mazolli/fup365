export const disableLogs = false;
export const libDir = 'C:/_apps/instantclient_21_14_64x/';

const connectionAttributes = {
  user: 'usina',
  password: 'megamega',
  connectString: '192.168.1.205:1521/usicoda',
  poolIncrement: 1, // only grow the pool by one connection at a time
  poolMax: 10, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
  poolMin: 0, // start with no connections; let the pool shrink completely
  poolPingInterval: 60, // check aliveness of connection if idle in the pool for 60 seconds
  poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
  queueMax: 500, // don't allow more than 500 unsatisfied getConnection() calls in the pool queue
  queueTimeout: 600000, // terminate getConnection() calls queued for longer than 60000 milliseconds
};

export default connectionAttributes;
