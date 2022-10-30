import {
  approveFriendRequest,
  cancelFriendRequest,
} from './../controllers/user-friend.controller';
import { Router } from 'express';
import {
  getFriendsRequest,
  sendFriendRequest,
} from 'src/controllers/user-friend.controller';
import { FriendRequestDto } from 'src/dto/friend';
import { FriendActionDto } from 'src/dto/friend/friend-actions-request.dto';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import validationMiddleware from 'src/middlewares/validation.middleware';
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
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   user:
 *                      type: string
 *                      description: user send request
 *                   owner:
 *                      type: string
 *                      description: user was sent request
 *                   status:
 *                      type: string
 *                      description: status
 *       500:
 *         description: Internal server error
 */

router.post(
  '/',
  requireAuthMiddleware,
  validationMiddleware(FriendRequestDto),
  sendFriendRequest
);

/**
 * @swagger
 * /api/friends/requests:
 *   get:
 *     summary: list request of user
 *     tags: [Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/getFriendRequest'
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   user:
 *                      type: object
 *                      description: user send request
 *                   owner:
 *                      type: string
 *                      description: user was sent request
 *                   status:
 *                      type: string
 *                      description: status
 *       500:
 *         description: Internal server error
 */

router.get('/requests', requireAuthMiddleware, getFriendsRequest);

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
  validationMiddleware(FriendActionDto),
  cancelFriendRequest
);

export const UserFriendRoutes = router;
