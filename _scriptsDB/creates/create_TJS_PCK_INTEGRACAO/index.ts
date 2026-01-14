import * as fs from 'fs';
import * as path from 'path';

const environment = (process.env.NODE_ENV || 'development').trim();
const dir =
  environment === 'development'
    ? path.join(__dirname)
    : path.join(
        __dirname,
        '..',
        '_scriptsDB',
        'creates',
        'create_TJS_PCK_INTEGRACAO'
      );

export const create_TJS_PCK_INTEGRACAO_Spec = fs.readFileSync(
  path.join(dir, 'TJS_PCK_INTEGRACAO.spc'),
  'utf8'
);

export const create_TJS_PCK_INTEGRACAO_Body = fs.readFileSync(
  path.join(dir, 'TJS_PCK_INTEGRACAO.bdy'),
  'utf8'
);
