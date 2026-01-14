const fs = require('fs');
const swaggerAutogen = require('swagger-autogen')();
const doc = require('./config/swagger.ts');

const outputFile = 'src/swagger/swagger_documentation.json';
const endpoints = ['src/routes/publicRoutes.ts'];

swaggerAutogen(outputFile, endpoints, doc).then(() => {
  // Lê o JSON gerado
  const swaggerData = JSON.parse(fs.readFileSync(outputFile));

  // Remove quaisquer rotas internas geradas indevidamente

  for (let i = 0; i < Object.keys(swaggerData.paths).length; i++) {
    const path = Object.keys(swaggerData.paths)[i];

    if (path.includes('/check')) {
      console.log(`🧹 Removendo rota interna detectada: ${path}`);
      delete swaggerData.paths[path];
    }
  }

  // Salva o arquivo corrigido
  fs.writeFileSync(outputFile, JSON.stringify(swaggerData, null, 2));
  console.log('✅ Swagger limpo e gerado com sucesso!');
});
