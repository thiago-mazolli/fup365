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
        'create_TJS_NOTIFICCFG'
      );

const create_TJS_NOTIFICCFG = fs.readFileSync(
  path.join(dir, 'TJS_NOTIFICCFG.tbl'),
  'utf8'
);
export const others_TJS_NOTIFICCFG_NFD_ST_AUTHMETODO = fs.readFileSync(
  path.join(dir, 'others_TJS_NOTIFICCFG_NFD_ST_AUTHMETODO.sql'),
  'utf8'
);
export const others_TJS_NOTIFICCFG_NFD_ST_WEBHOOKMETODO = fs.readFileSync(
  path.join(dir, 'others_TJS_NOTIFICCFG_NFD_ST_WEBHOOKMETODO.sql'),
  'utf8'
);
export const alter_PK_TJS_NOTIFICCFG = fs.readFileSync(
  path.join(dir, 'PK_TJS_NOTIFICCFG.sql'),
  'utf8'
);

export default create_TJS_NOTIFICCFG;
