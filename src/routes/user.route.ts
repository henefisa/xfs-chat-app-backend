import { Router } from 'express';
import passport from 'passport';
import {
  createUser,
  deleteUser,
  updateUser,
  getAllUser,
  getUserById,
  getUserProfile,
} from 'src/controllers/user.controller';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user';
import { GetUserDto } from 'src/dto/user/get-user.dto';
import roleMiddleware from 'src/middlewares/check-roles.middleware';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
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
 *       username:
 *             type: object
 *             properties:
 *              username:
 *                type: string
 *             example:
 *              username: khangkhang
 *       email:
 *             type: object
 *             properties:
 *              email:
 *                type: string
 *             example:
 *              email: "khang@gmail.com"
 *       sendRequest:
 *             type: object
 *             properties:
 *              user:
 *                type: string
 *                description: user send request
 *              owner:
 *                type: string
 *                description: user was sent request
 *             example:
 *              user: cf4040c0-a965-41e2-a1e1-cd0284e9cc7d
 *              owner: 78097c71-9937-4b68-8c51-e64bc88830c8
 *       getFriendRequest:
 *             type: object
 *             properties:
 *              owner:
 *                type: string
 *                description: id of owner
 *             example:
 *              owner: 78097c71-9937-4b68-8c51-e64bc88830c8
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
 *    name: Friends
 *    description: managing user friend API
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
 *         description: Internal server error
 */

router.post(
  '/',
  requireAuthMiddleware,
  roleMiddleware,
  validationMiddleware(CreateUserDto),
  createUser
);

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
 *      500:
 *        description: Internal server error
 */

router.put(
  '/:id',
  requireAuthMiddleware,
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
 *         description: User deleted
 */

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  deleteUser
);

/**
 * @swagger
 * /api/users/profile:
 *    get:
 *      summary: returns the list of user
 *      tags: [Users]
 *      responses:
 *          200:
 *            content:
 *                application/json:
 *                   schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/User'
 *      security:
 *          - bearerAuth: []
 */
router.get('/profile', requireAuthMiddleware, getUserProfile);

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
 */
router.get('/:id', requireAuthMiddleware, getUserById);

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
  requireAuthMiddleware,
  validationMiddleware(GetUserDto),
  getAllUser
);

export const UserRoutes = router;
