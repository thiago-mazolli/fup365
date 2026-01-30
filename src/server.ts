import { execSync } from 'child_process';
import { porta } from './config';
import findPIDByPort from './helpers/findPIDByPort';
import app from './App';

async function liberarPorta(porta: number) {
  try {
    const processos = await findPIDByPort(porta);
    // eslint-disable-next-line no-restricted-syntax
    for (const pid of processos.all) {
      console.log(
        `Finalizando processo ${pid} que está usando a porta ${porta}`
      );
      execSync(`taskkill /pid ${pid} /t`); // Removendo o `/f` para não forçar
    }
  } catch (error) {
    console.log(
      `Erro ao tentar liberar a porta ${porta}: ${(error as any).message}`
    );
  }
}

async function startServer() {
  await liberarPorta(porta);

  console.log('Aguardando a liberação completa da porta...');
  await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda 2 segundos antes de iniciar

  const server = app.listen(porta, '0.0.0.0', () => {
    console.log(`API rodando no localhost:${porta}`);
  });

  process.on('SIGINT', () => {
    console.log('Encerrando servidor...');
    server.close(() => {
      console.log('Servidor encerrado.');
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    console.log('Recebido SIGTERM, encerrando servidor...');
    server.close(() => {
      console.log('Servidor encerrado.');
      process.exit(0);
    });
  });
}

startServer();
