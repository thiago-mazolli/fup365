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
        'create_TJS_LOGS'
      );

const create_TJS_LOGS = fs.readFileSync(
  path.join(dir, 'TJS_LOGS.tbl'),
  'utf8'
);

export const others_LOG_CH_INT_STATUS = fs.readFileSync(
  path.join(dir, 'others_LOG_CH_INT_STATUS.sql'),
  'utf8'
);
export const others_LOG_CH_PERM_UPDATE = fs.readFileSync(
  path.join(dir, 'others_LOG_CH_PERM_UPDATE.sql'),
  'utf8'
);
export const others_LOG_CH_TYPE = fs.readFileSync(
  path.join(dir, 'others_LOG_CH_TYPE.sql'),
  'utf8'
);
export const others_LOG_CL_INT_XML = fs.readFileSync(
  path.join(dir, 'others_LOG_CL_INT_XML.sql'),
  'utf8'
);
export const others_LOG_DT_INSERT = fs.readFileSync(
  path.join(dir, 'others_LOG_DT_INSERT.sql'),
  'utf8'
);
export const others_LOG_DT_UPDATE = fs.readFileSync(
  path.join(dir, 'others_LOG_DT_UPDATE.sql'),
  'utf8'
);
export const others_LOG_IN_ID = fs.readFileSync(
  path.join(dir, 'others_LOG_IN_ID.sql'),
  'utf8'
);
export const others_LOG_IN_INT_SERVICO = fs.readFileSync(
  path.join(dir, 'others_LOG_IN_INT_SERVICO.sql'),
  'utf8'
);
export const others_LOG_ST_CAMPO_ADIC1 = fs.readFileSync(
  path.join(dir, 'others_LOG_ST_CAMPO_ADIC1.sql'),
  'utf8'
);
export const others_LOG_ST_CAMPO_ADIC2 = fs.readFileSync(
  path.join(dir, 'others_LOG_ST_CAMPO_ADIC2.sql'),
  'utf8'
);
export const others_LOG_ST_CAMPO_ADIC3 = fs.readFileSync(
  path.join(dir, 'others_LOG_ST_CAMPO_ADIC3.sql'),
  'utf8'
);
export const others_LOG_ST_CAMPO_ADIC4 = fs.readFileSync(
  path.join(dir, 'others_LOG_ST_CAMPO_ADIC4.sql'),
  'utf8'
);
export const others_LOG_ST_CAMPO_ADIC5 = fs.readFileSync(
  path.join(dir, 'others_LOG_ST_CAMPO_ADIC5.sql'),
  'utf8'
);
export const others_LOG_ST_INT_CODTRANSACAO = fs.readFileSync(
  path.join(dir, 'others_LOG_ST_INT_CODTRANSACAO.sql'),
  'utf8'
);
export const others_LOG_ST_INT_MSGERRO = fs.readFileSync(
  path.join(dir, 'others_LOG_ST_INT_MSGERRO.sql'),
  'utf8'
);
export const others_LOG_ST_INT_PKMEGA = fs.readFileSync(
  path.join(dir, 'others_LOG_ST_INT_PKMEGA.sql'),
  'utf8'
);
export const others_LOG_ST_MENSAGEM = fs.readFileSync(
  path.join(dir, 'others_LOG_ST_MENSAGEM.sql'),
  'utf8'
);
export const alter_PK_TJS_LOGS = fs.readFileSync(
  path.join(dir, 'PK_TJS_LOGS.sql'),
  'utf8'
);

export default create_TJS_LOGS;
