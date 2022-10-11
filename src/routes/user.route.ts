import { Router } from 'express';
import passport from 'passport';
import {
  createUser,
  deleteUser,
  updateUser,
  getAllUser,
  getUserById,
} from 'src/controllers/user.controller';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user';
import { GetUserDto } from 'src/dto/user/get-user.dto';
import validationMiddleware from 'src/middlewares/validation.middleware';

const router: Router = Router();
router.post(
  '/',
  validationMiddleware(CreateUserDto),
  createUser
  /**
       * #swagger.tags = ['User']
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
                description: 'User information.',
                required: true,
                schema: { $ref: "#/definitions/AddUser" }
        } 
        #swagger.responses[201] = { description: 'User registered successfully.' }
       */
);
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(UpdateUserDto),
  updateUser
  /**
   * #swagger.tags = ['User']
   * #swagger.produces = ['application/json']
     #swagger.consumes = ['application/json']
     #swagger.parameters['id'] = {
                in: 'path',
                description: 'User ID.',
                required: true,
                type: 'string'
            }
      #swagger.parameters['obj'] = {
                in: 'body',
                description: 'User data.',
                required: true,
                schema: {
                  username: "khangkhang",
                  fullName: "tran van khang",
                  avatar: "not",
                  email: "khang@gmail.com",
                  phone: "01658205896",
                }
            }    
      #swagger.responses[201] = { description: 'User updated successfully.'}        
   */
);
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  deleteUser
  /**
   * #swagger.tags = ['User']
   * #swagger.parameters['id'] = {
                in: 'path',
                description: 'User ID.',
                required: true,
                type: 'string'
            }
      #swagger.responses[204] = {
            description: 'User successfully deleted.',
          }      
   */
);
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  getUserById
  /**
   * #swagger.tags = ['User']
   * #swagger.parameters['id'] = {
                in: 'path',
                description: 'User ID.',
                required: true,
                type: 'string'
            }
      #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: { $ref: "#/definitions/User" }
          }      
   */
);
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(GetUserDto),
  getAllUser
  /**
   * #swagger.tags = ['User']
   * #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: { $ref: "#/definitions/User" }
          }
   */
);

export const UserRoutes = router;
