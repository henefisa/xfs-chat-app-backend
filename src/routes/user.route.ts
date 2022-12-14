import { Router } from 'express';
import * as userController from 'src/controllers/user.controller';
import { CheckEmailExistsDto, CheckUsernameExistsDto } from 'src/dto/auth';
import { UpdateUserDto } from 'src/dto/user';
import { GetUserDto } from 'src/dto/user/get-user.dto';
import { UpdatePasswordUserDto } from 'src/dto/user/update-password-user.dto';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import validationMiddleware, {
  validationQueryMiddleware,
} from 'src/middlewares/validation.middleware';
import activateMiddleware from 'src/middlewares/activate.middleware';

const router: Router = Router();
/**
 * @swagger
 * components:
 *    schemas:
 *       User:
 *          type: object
 *          required:
 *            - username
 *            - fullName
 *            - avatar
 *            - email
 *            - phone
 *          properties:
 *              username:
 *                type: string
 *              fullName:
 *                type: string
 *              avatar:
 *                type: string
 *              email:
 *                type: string
 *              phone:
 *                type: string
 *              description:
 *                type: string
 *              location:
 *                type: string
 *          example:
 *              username: khangkhang
 *              fullName: tran van khang
 *              avatar: not
 *              email: khangpro@gmail.com
 *              phone: 012345678
 *              description: khang
 *              location: VietNam
 *       Participant:
 *          type: object
 *          required:
 *            - conversation
 *            - user
 *            - adder
 *            - id
 *            - createdAt
 *            - updatedAt
 *          properties:
 *              conversation:
 *                type: string
 *              user:
 *                type: string
 *              adder:
 *                type: string
 *              id:
 *                type: string
 *              createdAt:
 *                type: string
 *              updatedAt:
 *                type: string
 *          example:
 *              conversation: "2f9ae041-2553-40ba-a9e7-c9c885873e85"
 *              user: "3e1b6781-a470-4a65-830c-973a19ed4559"
 *              adder: "8c9d761a-9356-4f9d-a603-d4c0b5756bd7"
 *              id: "590b7ef5-a722-45f3-bd25-b8124f41a069"
 *              createdAt: "2022-11-22T13:19:07.018Z"
 *              updatedAt: "2022-11-22T13:19:07.018Z"
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
 *       createMessage:
 *            type: object
 *            required:
 *              - conversation
 *              - message
 *            properties:
 *              conversation:
 *                type: string
 *              message:
 *                type: string
 *            example:
 *              conversation: "fbbb20b9-c25e-430b-9222-7acf59b0aa23"
 *              message: "Hello world!"
 *       expressFeeling:
 *            type: object
 *            required:
 *              - messageId
 *              - type
 *            properties:
 *              messageId:
 *                type: string
 *              type:
 *                type: string
 *            example:
 *              messageId: "8729cdc9-0598-47af-9b95-851f8a490a06"
 *              type: "FUN"
 *       addParticipant:
 *            type: object
 *            required:
 *              - userTarget
 *            example:
 *              userTarget: "2f9ae041-2553-40ba-a9e7-c9c885873e85"
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
 *       saveNotification:
 *            type: object
 *            required:
 *              - recipient
 *              - type
 *              - status
 *            properties:
 *              recipient:
 *                type: string
 *              type:
 *                type: string
 *              status:
 *                type: string
 *            example:
 *              recipient: "7b6b892b-ddbf-477b-97e6-c8758f975b39"
 *              status: "NOT_SEEN"
 *              type: "FRIEND_REQUEST"
 *       notification:
 *            type: object
 *            required:
 *              - recipient
 *              - type
 *              - status
 *            properties:
 *              id:
 *                type: string
 *              sender:
 *                type: string
 *              recipient:
 *                type: string
 *              type:
 *                type: string
 *              status:
 *                type: string
 *              createdAt:
 *                type: string
 *              updatedAt:
 *                type: string
 *            example:
 *              recipient: "7b6b892b-ddbf-477b-97e6-c8758f975b39"
 *              sender: "9e7e8a4b-9486-4049-b7ce-10c4107f4eb6"
 *              status: "NOT_SEEN"
 *              type: "FRIEND_REQUEST"
 *              createdAt: "2022-11-22T13:19:07.018Z"
 *              updatedAt: "2022-11-22T13:19:07.018Z"
 *       token:
 *             type: object
 *             properties:
 *              access_token:
 *                type: string
 *              refresh_token:
 *                type: string
 *             example:
 *              access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE0OTFlOTQyLTdhNDMtNDE4YS1iYWRjLTk3ZTlkNjVlYjU3ZiIsInVzZXJuYW1lIjoia2hhbmdraGFuZyIsImlhdCI6MTY2NTY2MjAxMSwiZXhwIjoxNjY1NzQ4NDExfQ.AvboGm3j-_cX-3iT7XZhA1cIlwPNNWq88HQoImQaRd8
 *              refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiN2Y5M2Y5LTAzY2QtNDQ4Ni04OGE2LWJiZThiYWZjYzUwMCIsInVzZXJuYW1lIjoia2hhbmcyMDM4IiwiaWF0IjoxNjY3ODkyMzExLCJleHAiOjE2NzA0ODQzMTF9.IrAF3FYeXBQB5Nv_wklMtsmlH6BbMb_bXwY-1cPa_MY
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
 *              userTarget:
 *                type: string
 *                description: user was sent request
 *             example:
 *              userTarget: cf4040c0-a965-41e2-a1e1-cd0284e9cc7d
 *       actionRequest:
 *             type: object
 *             properties:
 *              userRequest:
 *                type: string
 *                description: user sent the request
 *             example:
 *              userRequest: "cf4040c0-a965-41e2-a1e1-cd0284e9cc7d"
 *       password:
 *             type: object
 *             properties:
 *              password:
 *                type: string
 *             example:
 *              password: "htl27062003"
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
 * /api/users/password:
 *  put:
 *    summary: Update user password by the id
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/password'
 *    security:
 *          - bearerAuth: []
 *    responses:
 *      200:
 *        description: user password was updated
 *      500:
 *        description: Internal server error
 */

router.put(
  '/password',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(UpdatePasswordUserDto),
  userController.updatePasswordUser
);

/**
 * @swagger
 * /api/users/profile:
 *  patch:
 *    summary: Update user profile by the id
 *    tags: [Users]
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
 *        description: user profiles was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      500:
 *        description: Internal server error
 */

router.patch(
  '/profile',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(UpdateUserDto),
  userController.updateProfileUser
);

/**
 * @swagger
 * /api/users/delete:
 *   delete:
 *     summary: Self-delete user
 *     tags: [Users]
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted
 */

router.delete(
  '/delete',
  requireAuthMiddleware,
  activateMiddleware,
  userController.selfDeleteUser
);

/**
 * @swagger
 * /api/users/profile:
 *    get:
 *      summary: returns profile of user
 *      tags: [Users]
 *      responses:
 *          200:
 *            content:
 *                application/json:
 *                   schema:
 *                          $ref: '#/components/schemas/User'
 *      security:
 *          - bearerAuth: []
 */
router.get(
  '/profile',
  requireAuthMiddleware,
  activateMiddleware,
  userController.getUserProfile
);

/**
 * @swagger
 * /api/users:
 *    get:
 *      summary: returns the list of user
 *      tags: [Users]
 *      parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: search name or username or phone
 *         example: khang
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: status of user
 *       - in: query
 *         name: friendStatus
 *         schema:
 *           type: string
 *         required: false
 *         description: status of friend
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: page limit
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         required: false
 *         description: offset
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
  activateMiddleware,
  validationQueryMiddleware(GetUserDto),
  userController.getAllUser
);

/**
 * @swagger
 * /api/users/check-username-exists:
 *   post:
 *     summary: check username exists
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/username'
 *     responses:
 *       202:
 *         description: 'false'
 *       500:
 *         description: Some server error
 */

router.post(
  '/check-username-exists',
  validationMiddleware(CheckUsernameExistsDto),
  userController.checkUsernameExist
);

/**
 * @swagger
 * /api/users/check-email-exists:
 *   post:
 *     summary: check Email exists
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/email'
 *     responses:
 *       202:
 *         description: 'false'
 *       500:
 *         description: Some server error
 */
router.post(
  '/check-email-exists',
  validationMiddleware(CheckEmailExistsDto),
  userController.checkEmailExist
);

/**
 * @swagger
 * /api/users/deactivate:
 *   post:
 *     summary: self-deactivate or reactivate
 *     tags: [Users]
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       200:
 *         description: user was successfully created
 *       500:
 *         description: Some server error
 */

router.post(
  '/deactivate',
  requireAuthMiddleware,
  userController.selfDeactivate
);

export const userRoutes = router;
