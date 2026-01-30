/* eslint-disable no-unused-expressions */
import oracledb, { BLOB, BUFFER, CLOB, OUT_FORMAT_OBJECT } from 'oracledb';
import AppError from './AppError';
import IExecutaScriptProps from '../interfaces/IExecutaScriptProps';
import connectionAttributes, { disableLogs, libDir } from '../config/database';

/**
 * Função para fechar o pool de conexões e encerrar o processo
 */
const closePoolAndExit = async () => {
  try {
    // Obtém o pool do cache e fecha-o quando não houver conexões em uso,
    // ou força o fechamento após 10 segundos
    // Se isso travar, talvez seja necessário definir DISABLE_OOB=ON em um arquivo sqlnet.ora
    await oracledb.getPool().close(10);
    process.exit(0);
  } catch (error) {
    console.log((error as any).message);
    process.exit(1);
  }
};

/**
 * Função para liberar a conexão
 * @param {any} connection - A conexão a ser liberada
 * @param {boolean} disableLogs - Indica se os logs de erro devem ser desativados
 */
const doRelease = (connection: any, disableLogs: boolean) => {
  connection.close((err: any) => {
    if (err && disableLogs === false) console.error(err.message);
  });
};

/**
 * Função principal para executar um script no banco de dados
 * @param {IExecutaScriptProps} params - Os parâmetros para a execução do script
 * @returns {Promise<any>} - O resultado da execução do script
 */
const executaScript = async ({
  script,
  params,
  execSQL = false,
  numeroTentativas = 3,
}: IExecutaScriptProps): Promise<any> => {
  if (!connectionAttributes.connectString) {
    return;
  }

  let contadorTentativas = 0;
  let erroPersistente = '';

  // Loop para tentar executar o script várias vezes em caso de falha
  while (contadorTentativas <= numeroTentativas) {
    if (contadorTentativas > 0) {
      disableLogs === false &&
        console.log('Tentativa de Execução do Script Nº ', contadorTentativas);
    }

    // Configura os eventos para fechar o pool de conexões e encerrar o processo
    process.once('SIGTERM', closePoolAndExit).once('SIGINT', closePoolAndExit);

    // Configura as opções de fetch para CLOB, BUFFER e BLOB
    oracledb.fetchAsString = [oracledb.CLOB, oracledb.BUFFER];
    oracledb.fetchAsBuffer = [oracledb.BLOB];

    // Inicializa o cliente Oracle, se um diretório de bibliotecas for fornecido
    if (libDir !== undefined) {
      disableLogs === false && console.log('libDir', libDir);
      try {
        oracledb.initOracleClient({
          libDir,
        });

        disableLogs === false &&
          console.log('oracleClientVersion', oracledb.oracleClientVersion);
      } catch (error) {
        disableLogs === false &&
          console.log('executaScript_error:', (error as any).message);
      }
    }

    // Comandos para configurar a sessão do Oracle
    const alterSessionTimeZone = `ALTER SESSION SET TIME_ZONE='UTC'`;
    const alterSessionDateFormat = `ALTER SESSION SET NLS_DATE_FORMAT='DD/MM/RRRR'`;

    let connection;
    let tentativasConexao = 0;

    // Loop para tentar obter uma conexão com o banco de dados
    while (tentativasConexao <= 5 && !connection) {
      if (tentativasConexao > 0) {
        disableLogs === false &&
          console.log('Tentativa de Conexão Nº ', tentativasConexao);
      }

      try {
        connection = await oracledb.getConnection(connectionAttributes);
      } catch (error) {
        disableLogs === false && console.log('Erro ao buscas Conexão.', error);
        tentativasConexao++;
      }
    }

    if (!connection) {
      throw new AppError({
        error: 'Erro ao buscas Conexão',
        header: 'Erro na execução do script',
        script,
        params,
      });
    }

    try {
      const valScript = script
        .trim()
        .slice(0, 5)
        .toUpperCase();

      if (
        (valScript === 'BEGIN' || valScript === 'DECLA') &&
        execSQL === false
      ) {
        const cursor = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
        const sptParams = { cursor, ...params };

        await connection.execute(alterSessionTimeZone);
        await connection.execute(alterSessionDateFormat);

        const result = await connection.execute(script, sptParams, {
          outFormat: OUT_FORMAT_OBJECT,
        });

        const resultSet = (result.outBinds as any).cursor;
        const rows: any[] = [];
        let row: any;

        // Loop para obter as linhas do resultado do cursor
        // eslint-disable-next-line no-cond-assign
        while ((row = await resultSet.getRow())) {
          rows.push(row);
        }

        // Sempre feche o ResultSet
        await resultSet.close();

        return rows;
      }

      const cmdParams = Object.values(params);
      const options = {
        outFormat: OUT_FORMAT_OBJECT,
        autoCommit: true,
        fetchAsString: [CLOB, BUFFER],
        fetchAsBuffer: [BLOB],
      };

      oracledb.fetchAsString = [oracledb.CLOB, oracledb.BUFFER];
      await connection.execute(alterSessionTimeZone);
      await connection.execute(alterSessionDateFormat);

      const result = await connection.execute(script, cmdParams, options);

      if (
        (valScript === 'BEGIN' || valScript === 'DECLA') &&
        execSQL === true
      ) {
        return result;
      }

      return result.rows;
    } catch (error) {
      disableLogs === false && console.log('executaScript_error: ', error);

      if (
        ((error as any).message || '')
          .toString()
          .toUpperCase()
          .indexOf('ORA-28547'.toString().toUpperCase()) >= 0 ||
        ((error as any).message || '')
          .toString()
          .toUpperCase()
          .indexOf('ORA-3113'.toString().toUpperCase()) >= 0
      ) {
        contadorTentativas++;
        erroPersistente = (error as any).message;
      } else {
        throw new AppError({
          error,
          header: 'Erro na execução do script',
          script,
          params,
        });
      }
    } finally {
      doRelease(connection, disableLogs);
    }
  }

  if (erroPersistente === '') {
    throw new AppError({
      error: { message: 'Numero invalido de Tentativas' },
      header: 'Falha na conexão com o Banco de Dados',
      script,
      params,
    });
  }

  throw new AppError({
    header: 'Falha na conexão com o Banco de Dados',
    error: { message: erroPersistente },
    script,
    params,
  });
};

export default executaScript;
