import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'AutoCareNow API',
      version: '1.0.0',
      description: 'Documentação da API AutoCareNow',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Ajuste para a URL da sua API
      },
    ],
  },
  apis: ['./src/routes/*.js'], // caminho para as rotas com comentários Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
