import activateMiddleware from 'src/middlewares/activate.middleware';
import { Router } from 'express';
import { addMember, setAdmin } from 'src/controllers/participants.controller';
import { SetAdminDto } from 'src/dto/participant/set-admin.dto';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import validationMiddleware from 'src/middlewares/validation.middleware';
import { addParticipantDto } from 'src/dto/participant/add-participant.dto';

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
 *             $ref: '#/components/schemas/addParticipant'
 *     security:
 *          - bearerAuth: []
 *     responses:
 *       200:
 *         description: successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participant'
 */
router.post(
  '/:id',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(addParticipantDto),
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
  validationMiddleware(SetAdminDto),
  setAdmin
);

export const participantRoutes = router;
