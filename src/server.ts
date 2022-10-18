import express, { NextFunction, Request, Response } from 'express';
import { MainRoutes } from './routes';
import { HttpException } from './shares/http-exception';
import passport from 'passport';
import passportMiddleware from 'src/middlewares/passport';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import morgan from 'morgan';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'API',
    },
    servers: [{ url: 'http://localhost:8000' }],
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
app.use(morgan('tiny'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

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
app.use(passport.initialize());
app.use(express.json());
app.use('/api', MainRoutes);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TS server');
});

export default app;
