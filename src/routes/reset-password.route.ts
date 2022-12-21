import { Router } from 'express';
import { resetPassword, sendLink } from 'src/controllers/user.controller';
import { SendLinkDto, UpdatePasswordUserDto } from 'src/dto/user';
import validationMiddleware from 'src/middlewares/validation.middleware';
const router: Router = Router();

/**
 * @swagger
 * /api/reset-password/:
 *  post:
 *     summary: send link to email
 *     tags: [ResetPassword]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  description: khang@gmail.com
 *     responses:
 *       200:
 *          description: get presign url successfully
 */
router.post('/', validationMiddleware(SendLinkDto), sendLink);

router.post('/:id', validationMiddleware(UpdatePasswordUserDto), resetPassword);

export const resetPasswordRoutes = router;
