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
        'create_TJS_AGENTE'
      );

const create_TJS_AGENTE = fs.readFileSync(
  path.join(dir, 'TJS_AGENTE.tbl'),
  'utf8'
);
export const alter_PK_TJS_AGENTE = fs.readFileSync(
  path.join(dir, 'PK_TJS_AGENTE.sql'),
  'utf8'
);
export const alter_FK_TJS_AGN_GLOAGN = fs.readFileSync(
  path.join(dir, 'FK_TJS_AGN_GLOAGN.sql'),
  'utf8'
);

export default create_TJS_AGENTE;
