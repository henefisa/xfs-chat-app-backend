import swaggerAutogen from 'swagger-autogen';

const doc = {
  infor: {
    version: '3.0.0',
    title: 'REST API',
    description: 'managing API',
  },
  host: 'http://localhost:8000',
  basePath: '/api',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'User',
      description: 'managing user API',
    },
    {
      name: 'Auth',
      description: 'managing Auth API',
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  definitions: {
    User: {
      id: 'a491e942-7a43-418a-badc-97e9d65eb57f',
      username: 'khangkhang',
      email: 'khang@gmail.com',
      avartar: 'not',
      phone: '01658205896',
      full_name: 'tran van khang',
      status: 'INACTIVE',
      role: 'ADMIN',
    },
    AddUser: {
      $username: 'khangkhang',
      $password: '123',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/*.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
