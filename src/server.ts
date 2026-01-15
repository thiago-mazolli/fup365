import { exec, ExecException } from 'child_process';
import { porta } from './config';
import findPIDByPort from './helpers/findPIDByPort';
import app from './App';

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
        console.log(`API rodando no localhost: ${porta}`);
      });
    }
  })
  .catch(() => {
    app.listen(porta, '0.0.0.0').on('listening', () => {
      console.log(`API rodando no localhost: ${porta}`);
    });
  });
