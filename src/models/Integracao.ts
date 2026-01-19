import dateDBToDateJSON from '../helpers/dateDBToDateJSON';
import connectionAttributes, { disableLogs, libDir } from '../config/database';
import executaScript from '../helpers/executaScript';
import {
  gravaLogEnvioPRC,
  updateDataEnvioPRC,
  validaEnvioSBD,
  buscaPedidosSDB,
  buscaPedidosCanceladosSDB,
  buscaRecebimentosSDB,
} from '../repository/queryIntegracao';

export default class Integracao {
  static async buscaPedidos(): Promise<[]> {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaPedidosSDB,
      params: {
        // pMOD_ST_TBLMEGA: tblMega,
      },
    });

    return data.map((d: any) => ({
      pkMega: d.tblMega,
      tblMega: d.pkMega,
      dataModificacao: dateDBToDateJSON(d.dataModificacao),
      dataEnvio: dateDBToDateJSON(d.dataEnvio),
      registros: {
        formatdatetime: d.formatdatetime,
        pedidos: [
          {
            numero_pedido: d.numero_pedido,
            numero_legado: d.numero_legado,
            data_emissao: d.data_emissao,
            cliente_cnpj: d.cliente_cnpj,
            cliente_centro: d.cliente_centro,
            fornecedor: {
              fornecedor_cnpj: d.fornecedor_cnpj,
              fornecedor_razao: d.fornecedor_razao,
              fornecedor_endereco: d.fornecedor_endereco,
              fornecedor_numero: d.fornecedor_numero,
              fornecedor_bairro: d.fornecedor_bairro,
              fornecedor_cidade: d.fornecedor_cidade,
              fornecedor_uf: d.fornecedor_uf,
              fornecedor_contato1: d.contatos[0].fornecedor_contato,
              fornecedor_telefone1: d.contatos[0].fornecedor_telefone,
              fornecedor_celular1: d.contatos[0].fornecedor_celular,
              fornecedor_email1: d.contatos[0].fornecedor_email,
              fornecedor_contato2: d.contatos[0].fornecedor_contato,
              fornecedor_telefone2: d.contatos[0].fornecedor_telefone,
              fornecedor_celular2: d.contatos[0].fornecedor_celular,
              fornecedor_email2: d.contatos[0].fornecedor_email,
            },
            linhas: d.linhas,
          },
        ],
      },
    }));
  }

  static async buscaPedidosCancelados(): Promise<[]> {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaPedidosCanceladosSDB,
      params: {
        // pMOD_ST_TBLMEGA: tblMega,
      },
    });

    return data.map((d: any) => ({
      tblMega: d.MOD_ST_TBLMEGA,
      pkMega: d.MOD_ST_PKMEGA,
      dataModificacao: dateDBToDateJSON(d.dataModificacao),
      dataEnvio: dateDBToDateJSON(d.dataEnvio),
      registro: {
        ...d,
      },
    }));
  }

  static async buscaRecebimentos(): Promise<[]> {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaRecebimentosSDB,
      params: {
        // pMOD_ST_TBLMEGA: tblMega,
      },
    });

    return data.map((d: any) => ({
      tblMega: d.tblMega,
      pkMega: d.pkMega,
      dataModificacao: dateDBToDateJSON(d.dataModificacao),
      dataEnvio: dateDBToDateJSON(d.dataEnvio),
      registro: {
        formatdatetime: d.formatdatetime,
        pedidos: d.pedidos,
      },
    }));
  }

  static async updateDataEnvio(tblMega: string, pkMega: string) {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      execSQL: true,
      script: updateDataEnvioPRC,
      params: {
        pMOD_ST_TBLMEGA: tblMega,
        pMOD_ST_PKMEGA: pkMega,
      },
    });

    return data;
  }

  static async validaEnvio(tblMega: string, pkMega: string) {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: validaEnvioSBD,
      params: {
        pMOD_ST_TBLMEGA: tblMega,
        pMOD_ST_PKMEGA: pkMega,
      },
    });

    return data.length > 0;
  }

  static async gravaLogEnvio(
    tblMega: string,
    pkMega: string,
    status: string,
    message: string,
    request?: string,
    response?: string
  ) {
    const data = await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      execSQL: true,
      script: gravaLogEnvioPRC,
      params: {
        pMOD_ST_TBLMEGA: tblMega,
        pMOD_ST_PKMEGA: pkMega,
        pLOG_CH_STATUS: status,
        pLOG_ST_MSG: message,
        pLOG_CL_REQUEST: request || '',
        pLOG_CL_RESPONSE: response || '',
      },
    });

    return data;
  }
}
