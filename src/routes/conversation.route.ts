import { Router } from 'express';
import {
  createConversation,
  getConversationById,
  getConversations,
  GetConversations,
  updateConversation,
} from 'src/controllers/conversation.controller';
import { CreateConversationDto } from 'src/dto/conversation/create-conversation.dto';
import { GetConversationDto } from 'src/dto/conversation/get-conversation.dto';
import { UpdateConversationDto } from 'src/dto/conversation/update-conversation.dto';
import activateMiddleware from 'src/middlewares/activate.middleware';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import validationMiddleware, {
  validationQueryMiddleware,
} from 'src/middlewares/validation.middleware';

const router: Router = Router();

/**
 * @swagger
 * /api/conversations:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversations]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   title:
 *                      type: string
 *                      description: title of conversation
 *                   members:
 *                      type: array
 *                      items:
 *                         schema:
 *                             type: string
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: conversation was successfully created
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(CreateConversationDto),
  createConversation
);

/**
 * @swagger
 * /api/conversations/{id}:
 *  patch:
 *    summary: Update conversation
 *    tags: [Conversations]
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
 *         application/json:
 *            schema:
 *               type: object
 *               properties:
 *                    title:
 *                       type: string
 *                       description: title of conversation
 *                    avatar:
 *                       type: string
 *                       description: key of url
 *    security:
 *          - bearerAuth: []
 *    responses:
 *      200:
 *        description: user was updated
 *      500:
 *        description: Internal server error
 */

router.patch(
  '/:id',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(UpdateConversationDto),
  updateConversation
);

/**
 * @swagger
 * /api/conversations/groups:
 *    get:
 *      summary: returns the list conversations groups
 *      tags: [Conversations]
 *      parameters:
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
 *      responses:
 *          200:
 *            description: the list conversations
 *      security:
 *          - bearerAuth: []
 */

router.get(
  '/groups',
  requireAuthMiddleware,
  activateMiddleware,
  validationQueryMiddleware(GetConversationDto),
  getConversations
);

/**
 * @swagger
 * /api/conversations/{id}:
 *  get:
 *    summary: get conversation by the id
 *    tags: [Conversations]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: conversations id
 *    security:
 *          - bearerAuth: []
 *    responses:
 *      200:
 *        description: successful
 *      500:
 *        description: Internal server error
 */

router.get(
  '/:id',
  requireAuthMiddleware,
  activateMiddleware,
  getConversationById
);

/**
 * @swagger
 * /api/conversations:
 *    get:
 *      summary: returns the list conversations
 *      tags: [Conversations]
 *      parameters:
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
 *      responses:
 *          200:
 *            description: the list conversations
 *      security:
 *          - bearerAuth: []
 */

router.get(
  '/',
  requireAuthMiddleware,
  activateMiddleware,
  validationQueryMiddleware(GetConversationDto),
  GetConversations
);

export const conversationRoutes = router;
