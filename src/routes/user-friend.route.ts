import { Router } from 'express';
import {
	getFriends,
	getFriendsRequest,
	sendFriendRequest,
} from 'src/controllers/user-friend.controller';
import { FriendRequestDto } from 'src/dto/user';
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
 *   post:
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

router.post('/requests', requireAuthMiddleware, getFriendsRequest);

/**
 * @swagger
 * /api/friends/listFriend:
 *   post:
 *     summary: list friend of user
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

router.post('/listFriend', requireAuthMiddleware, getFriends);

export const UserFriendRoutes = router;
