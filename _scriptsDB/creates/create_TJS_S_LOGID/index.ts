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
        'create_TJS_S_LOGID'
      );

const create_TJS_S_LOGID = fs.readFileSync(
  path.join(dir, 'TJS_S_LOGID.seq'),
  'utf8'
);

export default create_TJS_S_LOGID;
