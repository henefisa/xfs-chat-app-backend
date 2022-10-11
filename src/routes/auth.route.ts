import validationMiddleware from 'src/middlewares/validation.middleware';
import { login, register } from 'src/controllers/auth.controller';
import { Router } from 'express';
import { LoginDto } from 'src/dto/auth';
import { RegisterDto } from 'src/dto/auth/register.dto';

const router: Router = Router();

router.post(
  '/login',
  validationMiddleware(LoginDto),
  login
  /**
       * #swagger.tags = ['Auth']
       * #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: { $ref: "#/definitions/AddUser" },
                  }
              }
          }    
         #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Username and password',
                required: true,
                schema: { $ref: "#/definitions/AddUser" }
         }
          #swagger.responses[200] = { 
            description: 'User registered successfully.',
            schema: {
               token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE0OTFlOTQyLTdhNDMtNDE4YS1iYWRjLTk3ZTlkNjVlYjU3ZiIsInVzZXJuYW1lIjoia2hhbmdraGFuZyIsImlhdCI6MTY2NTQ4MTk0NSwiZXhwIjoxNjY1NTY4MzQ1fQ.NWNVyyxIcYQ1htJspgLlcXqWr2MsGhNFNh_2OurxSgY",
            }
          }      
        } 
       */
);
router.post(
  '/register',
  validationMiddleware(RegisterDto),
  register
  /**
       * #swagger.tags = ['Auth']
       * #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: { $ref: "#/definitions/AddUser" },
                  }
              }
          }    

         #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Username and password.',
                required: true,
                schema: { $ref: "#/definitions/AddUser" }
          }
          #swagger.responses[201] = { description: 'User registered successfully.' }
        } 
       */
);

export const authRoutes = router;
