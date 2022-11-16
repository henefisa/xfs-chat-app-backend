import { GetUserFriendDto } from './../dto/friend/get-friend.dto';
import { validationQueryMiddleware } from 'src/middlewares/validation.middleware';
import {
  approveFriendRequest,
  cancelFriendRequest,
  cancelRequestToUser,
  getListFriends,
  getListRequest,
  getListSendRequest,
} from 'src/controllers/user-friend.controller';
import { Router } from 'express';
import { sendFriendRequest } from 'src/controllers/user-friend.controller';
import { FriendRequestDto } from 'src/dto/friend';
import { FriendActionDto } from 'src/dto/friend/friend-actions-request.dto';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import validationMiddleware from 'src/middlewares/validation.middleware';
import activateMiddleware from 'src/middlewares/activate.middleware';
import { GetUserDto } from 'src/dto/user/get-user.dto';
const router: Router = Router();

/**
 * @swagger
 * /api/friends:
 *   post:
 *     summary: send friend request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sendRequest'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: send request successfully
 *       500:
 *         description: Internal server error
 */

router.post(
  '/',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(FriendRequestDto),
  sendFriendRequest
);

/**
 * @swagger
 * /api/friends/list-request:
 *   get:
 *     summary: list request of user
 *     tags: [Friends]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: search name or username or phone
 *         example: khang
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
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 *       500:
 *         description: Internal server error
 */

router.get(
  '/list-request',
  requireAuthMiddleware,
  activateMiddleware,
  validationQueryMiddleware(GetUserFriendDto),
  getListRequest
);

/**
 * @swagger
 * /api/friends/list-send-request:
 *   get:
 *     summary: list send request of user
 *     tags: [Friends]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: search name or username or phone
 *         example: khang
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
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 *       500:
 *         description: Internal server error
 */

router.get(
  '/list-send-request',
  requireAuthMiddleware,
  activateMiddleware,
  validationQueryMiddleware(GetUserFriendDto),
  getListSendRequest
);

/**
 * @swagger
 * /api/friends/list-friends:
 *   get:
 *     summary: list friend of user
 *     tags: [Friends]
 *     parameters:
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
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 *       500:
 *         description: Internal server error
 */

router.get(
  '/list-friends',
  requireAuthMiddleware,
  activateMiddleware,
  validationQueryMiddleware(GetUserDto),
  getListFriends
);

/**
 * @swagger
 * /api/friends/approve:
 *   post:
 *     summary: send friend approve request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/actionRequest'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: Accepted as a friend
 *       500:
 *         description: Internal server error
 */

router.post(
  '/approve',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(FriendActionDto),
  approveFriendRequest
);

/**
 * @swagger
 * /api/friends/cancel:
 *   post:
 *     summary: send friend cancel request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/actionRequest'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *        description: Cancelled as a friend
 *       500:
 *         description: Internal server error
 */

router.post(
  '/cancel',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(FriendActionDto),
  cancelFriendRequest
);

/**
 * @swagger
 * /api/friends/cancel-request:
 *   post:
 *     summary:  cancel request
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/actionRequest'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *        description: Cancelled as a friend
 *       500:
 *         description: Internal server error
 */

router.post(
  '/cancel-request',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(FriendActionDto),
  cancelRequestToUser
);
export const userFriendRoutes = router;
