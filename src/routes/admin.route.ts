import { Router } from 'express';
import { CreateUserDto } from 'src/dto/user';
import { GetUserDto } from 'src/dto/user/get-user.dto';
import roleMiddleware from 'src/middlewares/check-roles.middleware';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import validationMiddleware, {
  validationQueryMiddleware,
} from 'src/middlewares/validation.middleware';
import activateMiddleware from 'src/middlewares/activate.middleware';
import * as adminController from 'src/controllers/admin.controller';
import { AdminUpdateRoleUserDto } from 'src/dto/admin';
import { CountMessageDto } from 'src/dto/message';

const router: Router = Router();

/**
 * @swagger
 * /api/admin/user:
 *   post:
 *     summary: Create a new user
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createUser'
 *     security:
 *        - bearerAuth: []
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
  '/user',
  requireAuthMiddleware,
  roleMiddleware,
  activateMiddleware,
  validationMiddleware(CreateUserDto),
  adminController.createUser
);

/**
 * @swagger
 * /api/admin/user/{id}:
 *  patch:
 *    summary: Update role user by the id
 *    tags: [Admins]
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
 *            type: object
 *            properties:
 *                role:
 *                  type: string
 *    security:
 *          - bearerAuth: []
 *    responses:
 *      200:
 *        description: user was updated
 */

router.patch(
  '/user/:id',
  requireAuthMiddleware,
  roleMiddleware,
  activateMiddleware,
  validationMiddleware(AdminUpdateRoleUserDto),
  adminController.updateRoleUser
);

/**
 * @swagger
 * /api/admin/user/{id}:
 *   get:
 *     summary: Get user by id
 *     tags: [Admins]
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
router.get(
  '/user/:id',
  requireAuthMiddleware,
  activateMiddleware,
  roleMiddleware,
  adminController.getUserById
);

/**
 * @swagger
 * /api/admin/user:
 *    get:
 *      summary: returns the list of user
 *      tags: [Admins]
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
 *      security:
 *         - bearerAuth: []
 *      responses:
 *          200:
 *            description: the list of user
 */

router.get(
  '/user',
  requireAuthMiddleware,
  activateMiddleware,
  roleMiddleware,
  validationQueryMiddleware(GetUserDto),
  adminController.getAllUser
);

/**
 * @swagger
 * /api/admin/user/banned/{id}:
 *   post:
 *     summary: ban user by id
 *     tags: [Admins]
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
 */

router.post(
  '/user/banned/:id',
  requireAuthMiddleware,
  activateMiddleware,
  roleMiddleware,
  adminController.banUser
);

/**
 * @swagger
 * /api/admin/user/unbanned/{id}:
 *   post:
 *     summary: unbanned user by id
 *     tags: [Admins]
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
 */

router.post(
  '/user/unbanned/:id',
  requireAuthMiddleware,
  activateMiddleware,
  roleMiddleware,
  adminController.unbannedUser
);

/**
 * @swagger
 * /api/admin/user/statistics/{id}:
 *    get:
 *      summary: returns amount of messages
 *      tags: [Admins]
 *      parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id of user
 *       - in: query
 *         name: conversationId
 *         schema:
 *           type: string
 *         required: false
 *         description: count with conversation
 *      security:
 *         - bearerAuth: []
 *      responses:
 *          200:
 *            description: the list of user
 */

router.get(
  'user/statistics/:id',
  requireAuthMiddleware,
  activateMiddleware,
  roleMiddleware,
  validationQueryMiddleware(CountMessageDto),
  adminController.getStatistics
);

export const adminRoutes = router;
