import fs from 'fs';
import path from 'path';

const environment = (process.env.NODE_ENV || 'development').trim();
const dir =
  environment === 'development'
    ? path.join(__dirname)
    : path.join(
        __dirname,
        '..',
        '_scriptsDB',
        'creates',
        'create_TJS_INTEGRACAOCFG'
      );

const create_TJS_INTEGRACAOCFG = fs.readFileSync(
  path.join(dir, 'TJS_INTEGRACAOCFG.tbl'),
  'utf8'
);
export const others_CFG_ST_AUTHMETODO = fs.readFileSync(
  path.join(dir, 'others_CFG_ST_AUTHMETODO.sql'),
  'utf8'
);
export const others_CFG_ST_METODO = fs.readFileSync(
  path.join(dir, 'others_CFG_ST_METODO.sql'),
  'utf8'
);
export const alter_PK_TJS_INTEGRACAOCFG = fs.readFileSync(
  path.join(dir, 'PK_TJS_INTEGRACAOCFG.sql'),
  'utf8'
);

export default create_TJS_INTEGRACAOCFG;
