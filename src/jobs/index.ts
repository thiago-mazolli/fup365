/* eslint-disable import/no-extraneous-dependencies */
import cron from 'node-cron';
import axios from 'axios';
import {
  hostLocal,
  taskPedido,
  taskPedidoCanc,
  taskRecebimento,
} from '../config';

let isRunningJobPedido = false;

const JobPedido = cron.schedule(
  taskPedido,
  () => {
    if (isRunningJobPedido) {
      console.log('JOB Pedido : já em execução, pulando...');
      return;
    }
    isRunningJobPedido = true;
    const inicio = Date.now();
    console.log('JOB Pedido : Iniciando');
    axios
      .get(`${hostLocal}/envia-pedidos`)
      .then(() => {
        console.log('JOB Pedido : Processo realizado com sucesso.');
      })
      .catch(error => {
        console.log(error);
        console.log('JOB Pedido : Erro ao executar o processo.');
      })
      .finally(() => {
        const fim = Date.now();
        const duracaoSegundos = ((fim - inicio) / 1000).toFixed(2);
        console.log(`JOB Pedido : Finalizado em ${duracaoSegundos}s`);
        isRunningJobPedido = false;
      });
  },
  {
    scheduled: false,
  }
);

let isRunningJobPedidoCanc = false;

const JobPedidoCanc = cron.schedule(
  taskPedidoCanc,
  () => {
    if (isRunningJobPedidoCanc) {
      console.log('JOB PedidoCanc : já em execução, pulando...');
      return;
    }
    isRunningJobPedidoCanc = true;
    const inicio = Date.now();
    console.log('JOB PedidoCanc : Iniciando');
    axios
      .get(`${hostLocal}/envia-cancelados`)
      .then(() => {
        console.log('JOB PedidoCanc : Processo realizado com sucesso.');
      })
      .catch(error => {
        console.log(error);
        console.log('JOB PedidoCanc : Erro ao executar o processo.');
      })
      .finally(() => {
        const fim = Date.now();
        const duracaoSegundos = ((fim - inicio) / 1000).toFixed(2);
        console.log(`JOB PedidoCanc : Finalizado em ${duracaoSegundos}s`);
        isRunningJobPedidoCanc = false;
      });
  },
  {
    scheduled: false,
  }
);

let isRunningJobRecebimento = false;

const JobRecebimento = cron.schedule(
  taskRecebimento,
  () => {
    if (isRunningJobRecebimento) {
      console.log('JOB Recebimento : já em execução, pulando...');
      return;
    }
    isRunningJobRecebimento = true;
    const inicio = Date.now();
    console.log('JOB Recebimento : Iniciando');
    axios
      .get(`${hostLocal}/envia-recebimentos`)
      .then(() => {
        console.log('JOB Recebimento : Processo realizado com sucesso.');
      })
      .catch(error => {
        console.log(error);
        console.log('JOB Recebimento : Erro ao executar o processo.');
      })
      .finally(() => {
        const fim = Date.now();
        const duracaoSegundos = ((fim - inicio) / 1000).toFixed(2);
        console.log(`JOB Recebimento : Finalizado em ${duracaoSegundos}s`);
        isRunningJobRecebimento = false;
      });
  },
  {
    scheduled: false,
  }
);

export default function initJobs() {
  JobPedido.start();
  JobPedidoCanc.start();
  JobRecebimento.start();
}
