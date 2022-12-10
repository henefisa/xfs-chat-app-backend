import express, { NextFunction, Request, Response } from 'express';
import { MainRoutes } from './routes';
import { HttpException } from './shares/http-exception';
import passport from 'passport';
import passportMiddleware from 'src/middlewares/passport';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import { config as AWSConfig } from 'aws-sdk';
import 'src/configs/Redis';

config();

const port = process.env.PORT || 8000;
const swaggerHost = process.env.SWAGGER_HOST || '18.142.254.133.sslip.io';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'API',
    },
    servers: [{ url: `https://${swaggerHost}:${port}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [`${__dirname}/routes/*.{ts,js}`],
};

const specs = swaggerJSDoc(options);

const app = express();

app.disable('x-powered-by');

app.use(morgan('tiny'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

AWSConfig.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});

const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof HttpException) {
    return response.status(error.status).json({
      statusCode: error.status || 400,
      message: error.message,
      timestamp: Date.now(),
      path: request.path,
      errors: error.errors,
    });
  }

  next(error);
};

passport.use(passportMiddleware);
app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use('/api', MainRoutes);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TS server');
});

export default app;
