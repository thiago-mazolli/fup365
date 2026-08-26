import dateDBToDateJSON from '../helpers/dateDBToDateJSON';

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
    console.log('buscaPedidos');
    const data = await executaScript({
      script: buscaPedidosSDB,
      params: {
        // pMOD_ST_TBLMEGA: tblMega,
      },
    });
    // console.log('buscaPedidos data:', data);

    return data.map((d: any) => ({
      tblMega: d.tblMega,
      pkMega: d.pkMega,
      dataModificacao: dateDBToDateJSON(d.dataModificacao),
      dataEnvio: dateDBToDateJSON(d.dataEnvio),
      body: {
        formatdatetime: 'Y-m-d H:i:s',
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
              fornecedor_contato1: d.contatos[0]
                ? d.contatos[0].fornecedor_contato
                : null,
              fornecedor_telefone1: d.contatos[0]
                ? d.contatos[0].fornecedor_telefone
                : null,
              fornecedor_celular1: d.contatos[0]
                ? d.contatos[0].fornecedor_celular
                : null,
              fornecedor_email1: d.contatos[0]
                ? d.contatos[0].fornecedor_email
                : null,
              fornecedor_contato2: d.contatos[1]
                ? d.contatos[1].fornecedor_contato
                : null,
              fornecedor_telefone2: d.contatos[1]
                ? d.contatos[1].fornecedor_telefone
                : null,
              fornecedor_celular2: d.contatos[1]
                ? d.contatos[1].fornecedor_celular
                : null,
              fornecedor_email2: d.contatos[1]
                ? d.contatos[1].fornecedor_email
                : null,
            },
            linhas: d.linhas,
          },
        ],
      },
    }));
  }

  static async buscaPedidosCancelados(): Promise<[]> {
    console.log('buscaPedidosCancelados');
    const data = await executaScript({
      script: buscaPedidosCanceladosSDB,
      params: {
        // pMOD_ST_TBLMEGA: tblMega,
      },
    });
    // console.log('buscaPedidosCancelados data:', data);

    return data.map((d: any) => ({
      tblMega: d.tblMega,
      pkMega: d.pkMega,
      dataModificacao: dateDBToDateJSON(d.dataModificacao),
      dataEnvio: dateDBToDateJSON(d.dataEnvio),
      body: {
        formatdatetime: 'Y-m-d H:i:s',
        pedidos: [
          {
            numero_pedido: d.numero_pedido,
            numero_linha: 999999,
            cancelado_data: d.cancelado_data,
          },
        ],
      },
    }));
  }

  static async buscaRecebimentos(): Promise<[]> {
    console.log('buscaRecebimentos');
    const data = await executaScript({
      script: buscaRecebimentosSDB,
      params: {
        // pMOD_ST_TBLMEGA: tblMega,
      },
    });
    // console.log('buscaRecebimentos data:', data);

    return data.map((d: any) => ({
      tblMega: d.tblMega,
      pkMega: d.pkMega,
      dataModificacao: dateDBToDateJSON(d.dataModificacao),
      dataEnvio: dateDBToDateJSON(d.dataEnvio),
      body: {
        formatdatetime: 'Y-m-d H:i:s',
        pedidos: d.pedidos,
      },
    }));
  }

  static async updateDataEnvio(tblMega: string, pkMega: string) {
    console.log('updateDataEnvio');
    const data = await executaScript({
      execSQL: true,
      script: updateDataEnvioPRC,
      params: {
        pMOD_ST_TBLMEGA: tblMega,
        pMOD_ST_PKMEGA: pkMega,
      },
    });
    // console.log('updateDataEnvio data:', data);

    return data;
  }

  static async validaEnvio(tblMega: string, pkMega: string) {
    console.log('validaEnvio tblMega|pkMega:', `${tblMega}|${pkMega}`);
    const data = await executaScript({
      script: validaEnvioSBD,
      params: {
        pMOD_ST_TBLMEGA: tblMega,
        pMOD_ST_PKMEGA: pkMega,
      },
    });
    // console.log('validaEnvio data:', data);

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
    console.log('gravaLogEnvio');
    const data = await executaScript({
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
    // console.log('gravaLogEnvio data:', data);

    return data;
  }
}
