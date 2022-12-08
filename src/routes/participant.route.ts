import activateMiddleware from 'src/middlewares/activate.middleware';
import { Router } from 'express';
import {
  addMember,
  setAdmin,
  getParticipants,
  deleteParticipant,
} from 'src/controllers/participants.controller';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import validationMiddleware from 'src/middlewares/validation.middleware';
import adminGroupMiddleware from 'src/middlewares/admin-group.middleware';
import {
  AddParticipantDto,
  DeleteParticipantDto,
  SetAdminDto,
} from 'src/dto/participant';

const router: Router = Router();

/**
 * @swagger
 * /api/participants/{id}:
 *   post:
 *     summary: add member into conversation
 *     tags: [Participant]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: conversation id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               members:
 *                 type: array
 *                 items:
 *                   schema:
 *                      type:string
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 */
router.post(
  '/:id',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(AddParticipantDto),
  addMember
);

/**
 * @swagger
 * /api/participants/set-admin/{id}:
 *   post:
 *     summary: set admin of conversation
 *     tags: [Participant]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: conversation id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                userId:
 *                   type: string
 *                   description: id of user
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 */
router.post(
  '/set-admin/:id',
  requireAuthMiddleware,
  activateMiddleware,
  adminGroupMiddleware,
  validationMiddleware(SetAdminDto),
  setAdmin
);

/**
 * @swagger
 * /api/participants/{id}:
 *   delete:
 *     summary: delete participant
 *     tags: [Participant]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: conversation id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                userId:
 *                   type: string
 *                   description: id of user
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 */
router.delete(
  '/:id',
  requireAuthMiddleware,
  activateMiddleware,
  adminGroupMiddleware,
  validationMiddleware(DeleteParticipantDto),
  deleteParticipant
);

/**
 * @swagger
 * /api/participants/{id}:
 *   get:
 *     summary: get participants in conversation
 *     tags: [Participant]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: conversation id
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: the list participant
 */

router.get('/:id', requireAuthMiddleware, getParticipants);

export const participantRoutes = router;
