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
        'create_TJS_PCK_LOGS'
      );

export const create_TJS_PCK_LOGS_Spec = fs.readFileSync(
  path.join(dir, 'TJS_PCK_LOGS.spc'),
  'utf8'
);

export const create_TJS_PCK_LOGS_Body = fs.readFileSync(
  path.join(dir, 'TJS_PCK_LOGS.bdy'),
  'utf8'
);
