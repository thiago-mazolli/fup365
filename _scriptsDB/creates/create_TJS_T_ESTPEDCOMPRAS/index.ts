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
        'create_TJS_T_ESTPEDCOMPRAS'
      );

const create_TJS_T_ESTPEDCOMPRAS = fs.readFileSync(
  path.join(dir, 'TJS_T_ESTPEDCOMPRAS.trg'),
  'utf8'
);

export default create_TJS_T_ESTPEDCOMPRAS;
