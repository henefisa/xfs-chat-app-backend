import { expressFeelingDto } from 'src/dto/emoticon/express-feeling.dto';
import { Router } from 'express';
import {
  hideMessage,
  sendMessage,
} from 'src/controllers/hide-message.controller';
import { deleteMessage, getMessages } from 'src/controllers/message.controller';
import { GetMessageDto } from 'src/dto/message';
import activateMiddleware from 'src/middlewares/activate.middleware';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import { validationQueryMiddleware } from 'src/middlewares/validation.middleware';
import * as EmoticonControllers from 'src/controllers/emotion.controller';

const router: Router = Router();

/**
 * @swagger
 * /api/messages/delete:
 *   delete:
 *     summary: delete message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sendDeleteRequest'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       204:
 *         description: Message deleted
 */
router.delete(
  '/delete',
  requireAuthMiddleware,
  activateMiddleware,
  deleteMessage
);

/**
 * @swagger
 * /api/messages/hide-message:
 *   post:
 *     summary: hide message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/sendDeleteRequest'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       204:
 *         description: message has been hidden
 */
router.post('/hide-message', hideMessage);
/**
 * @swagger
 * /api/messages/send-message:
 *   post:
 *     summary: send message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createMessage'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       204:
 *         description: message has been hidden
 */
router.post('/send-message', requireAuthMiddleware, sendMessage);

/**
 * @swagger
 * /api/messages/{id}:
 *    get:
 *      summary: messages of conversation
 *      tags: [Messages]
 *      parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: id of conversation
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: search messages
 *         example: hello
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
 *            description: succesfully
 *      security:
 *          - bearerAuth: []
 */

router.get(
  '/:id',
  requireAuthMiddleware,
  activateMiddleware,
  validationQueryMiddleware(GetMessageDto),
  getMessages
);

/**
 * @swagger
 * /api/messages/express-feeling:
 *   post:
 *     summary: express feeling
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/expressFeeling'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       204:
 *         description: expressed feeling
 */
router.post(
  '/express-feeling',
  requireAuthMiddleware,
  activateMiddleware,
  validationQueryMiddleware(expressFeelingDto),
  EmoticonControllers.expressFeeling
);

/**
 * @swagger
 * /api/messages/emotions/{id}:
 *   get:
 *     summary: get emotions in message
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: message id
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: emotions
 */

router.get(
  '/emotions/:id',
  requireAuthMiddleware,
  activateMiddleware,
  EmoticonControllers.getEmotions
);

export const messageRoutes = router;
