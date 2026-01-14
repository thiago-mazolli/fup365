const { productBuild } = require('../../config');
const { productInfo } = require('../../config/productInfo.ts');

// const Token = require('../documentation/Token.ts');

module.exports = {
  info: {
    version: productBuild,
    title: productInfo.productName,
    description: 'Documentação da API de Integração',
  },
  host: productInfo.productDNS,
  schemes: ['https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    JWT: {
      description: 'JWT token',
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    },
  },
  definitions: {
    // Token,
  },
};
