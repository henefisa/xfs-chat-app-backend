import { GetUserFriendDto } from './../dto/friend/get-friend.dto';
import { validationQueryMiddleware } from 'src/middlewares/validation.middleware';
import {
  approveFriendRequest,
  cancelRequest,
  getFriends,
} from 'src/controllers/user-friend.controller';
import { Router } from 'express';
import { FriendActionDto } from 'src/dto/friend/friend-actions-request.dto';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import validationMiddleware from 'src/middlewares/validation.middleware';
import activateMiddleware from 'src/middlewares/activate.middleware';
const router: Router = Router();

/**
 * @swagger
 * /api/friends:
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
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: status of user friend
 *         example: ACCEPTED
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
  '/',
  requireAuthMiddleware,
  activateMiddleware,
  validationQueryMiddleware(GetUserFriendDto),
  getFriends
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
 *     summary: cancel request to user
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
  cancelRequest
);
export const userFriendRoutes = router;
