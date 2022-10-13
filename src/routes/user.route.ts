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

/**
 * @swagger
 * components:
 *    schemas:
 *       User:
 *          type: object
 *          required:
 *            - username
 *            - full_name
 *            - avatar
 *            - email
 *            - phone
 *          properties:
 *              username:
 *                type: string
 *              full_name:
 *                type: string
 *              avatar:
 *                type: string
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *          example:
 *              username: khangkhang
 *              full_name: tran van khang
 *              avatar: not
 *              email: khangpro@gmail.com
 *              phone: 012345678
 *       createUser:
 *            type: object
 *            required:
 *              - email
 *              - username
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              username:
 *                type: string
 *              password:
 *                type: string
 *            example:
 *              email: khang@gmail.com
 *              username: khang2038
 *              password: khang123
 *       login:
 *            type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *            example:
 *              username: khangkhang
 *              password: "123"
 *       token:
 *             type: object
 *             properties:
 *              access_token:
 *                type: string
 *             example:
 *              access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE0OTFlOTQyLTdhNDMtNDE4YS1iYWRjLTk3ZTlkNjVlYjU3ZiIsInVzZXJuYW1lIjoia2hhbmdraGFuZyIsImlhdCI6MTY2NTY2MjAxMSwiZXhwIjoxNjY1NzQ4NDExfQ.AvboGm3j-_cX-3iT7XZhA1cIlwPNNWq88HQoImQaRd8
 */

/**
 * @swagger
 * tags:
 *    name: Users
 *    description: managing user API
 */
/**
 * @swagger
 * tags:
 *    name: Auth
 *    description: managing authentication
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createUser'
 *     responses:
 *       200:
 *         description: user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/createUser'
 *       500:
 *         description: Some server error
 */

router.post('/', validationMiddleware(CreateUserDto), createUser);

/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *    summary: Update user by the id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    security:
 *          - bearerAuth: []
 *    responses:
 *      200:
 *        description: user was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: user was not found
 *      500:
 *        description: Some error happened
 */

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(UpdateUserDto),
  updateUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: user id
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       204:
 *         description: user deleted
 *       404:
 *         description: user was not found
 */

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  deleteUser
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: user id
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  getUserById
);

/**
 * @swagger
 * /api/users:
 *    get:
 *      summary: returns the list of user
 *      tags: [Users]
 *      responses:
 *          200:
 *            description: the list of user
 *            content:
 *                application/json:
 *                   schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/User'
 *      security:
 *          - bearerAuth: []
 */

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(GetUserDto),
  getAllUser
);

export const UserRoutes = router;
