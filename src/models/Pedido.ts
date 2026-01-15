import connectionAttributes, { libDir, disableLogs } from '../config/database';
import {
  buscaContasPagarSDB,
  buscaRecebimentosSDB,
  cancelaPedidoPRC,
} from '../repository/queryPedido';
import IPedidoReceb from '../interfaces/IPedidoReceb';
import IPedidoAP from '../interfaces/IPedidoAP';
import dateDBToDateJSON from '../helpers/dateDBToDateJSON';
import executaScript from '../helpers/executaScript';

export default class Pedido {
  static async cancelaPedido(pkMega: string) {
    await executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      execSQL: true,
      script: cancelaPedidoPRC,
      params: {
        pORG_TAB_IN_CODIGO: pkMega.split(';')[0],
        pORG_PAD_IN_CODIGO: pkMega.split(';')[1],
        pORG_IN_CODIGO: pkMega.split(';')[2],
        pORG_TAU_ST_CODIGO: pkMega.split(';')[3],
        pSER_TAB_IN_CODIGO: pkMega.split(';')[4],
        pSER_IN_SEQUENCIA: pkMega.split(';')[5],
        pPDC_IN_CODIGO: pkMega.split(';')[6],
      },
    });

    return { message: 'Pedido cancelado com sucesso' };
  }

  static async buscaRecebimentos(
    dataInicial?: string,
    dataFinal?: string
  ): Promise<IPedidoReceb[]> {
    const data = await (<Promise<IPedidoReceb[]>>executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaRecebimentosSDB,
      params: {
        pDATAINI: dataInicial || null,
        pDATAFIM: dataFinal || null,
      },
    }));

    return data.map(d => ({
      ...d,
      itens: d.itens.map(i => ({
        ...i,
        dataRecebimento: dateDBToDateJSON(i.dataRecebimento),
      })),
    }));
  }

  static async buscaContasPagar(
    dataInicial?: string,
    dataFinal?: string
  ): Promise<IPedidoAP[]> {
    const data = await (<Promise<IPedidoAP[]>>executaScript({
      connectionAttributes,
      libDir,
      disableLogs,
      script: buscaContasPagarSDB,
      params: {
        pDATAINI: dataInicial || null,
        pDATAFIM: dataFinal || null,
      },
    }));

    return data.map(d => ({
      ...d,
      parcelas: d.parcelas.map(p => ({
        ...p,
        dataVencimento: dateDBToDateJSON(p.dataVencimento),
        dataVencProrrogado: dateDBToDateJSON(p.dataVencProrrogado),
        dataPagamento: dateDBToDateJSON(p.dataPagamento),
      })),
    }));
  }
}
