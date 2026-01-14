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
        'create_TJS_INTEGRACAOMOD'
      );

const create_TJS_INTEGRACAOMOD = fs.readFileSync(
  path.join(dir, 'TJS_INTEGRACAOMOD.tbl'),
  'utf8'
);
export const alter_PK_TJS_INTEGRACAOMOD = fs.readFileSync(
  path.join(dir, 'PK_TJS_INTEGRACAOMOD.sql'),
  'utf8'
);

export default create_TJS_INTEGRACAOMOD;
