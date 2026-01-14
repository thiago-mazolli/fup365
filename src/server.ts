import { exec, ExecException } from 'child_process';
import { consoleLog } from 'dev4-code-library';
import { findPIDByPort } from 'dev4-node-library';
import app from './App';

const porta = 37010; // main

findPIDByPort(porta)
  .then(r => {
    let haveErr = false;
    for (let i = 0; i < r.all.length; i++) {
      const p = r.all[i];
      // eslint-disable-next-line no-loop-func
      exec(`taskkill /pid ${p} /f`, (err: ExecException | null) => {
        if (err) {
          haveErr = true;
        }
      });
    }
    if (haveErr === false) {
      app.listen(porta, '0.0.0.0').on('listening', () => {
        consoleLog(`API rodando no localhost: ${porta}`);
      });
    }
  })
  .catch(() => {
    app.listen(porta, '0.0.0.0').on('listening', () => {
      consoleLog(`API rodando no localhost: ${porta}`);
    });
  });
