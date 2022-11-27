import { Router } from 'express';
import {
  getPreSignedUrl,
  getSignedUrl,
} from 'src/controllers/upload.controller';
import { GetPreSignedUrlDto } from 'src/dto/upload/get-presign-url.dto';
import activateMiddleware from 'src/middlewares/activate.middleware';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import validationMiddleware from 'src/middlewares/validation.middleware';
const router: Router = Router();

/**
 * @swagger
 * /api/upload/presign-url:
 *  post:
 *     summary: Get presign url
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                key:
 *                  type: string
 *                  description: filename.jpg
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       200:
 *          description: get presign url successfully
 *          content:
 *            application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                    url:
 *                       type: string
 *                       description: upload URL
 *                    key:
 *                       type: string
 *                       description: Using this key to save to database
 */

router.post(
  '/presign-url',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(GetPreSignedUrlDto),
  getPreSignedUrl
);

/**
 * @swagger
 * /api/upload/sign-url:
 *  post:
 *     summary: Get presign url
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                key:
 *                  type: string
 *                  description: filename.jpg
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       200:
 *          description: get presign url successfully
 *          content:
 *            application/json:
 *              schema:
 *                 type: object
 *                 properties:
 *                    url:
 *                       type: string
 *                       description: upload URL
 *                    key:
 *                       type: string
 *                       description: Using this key to save to database
 */

router.post(
  '/sign-url',
  requireAuthMiddleware,
  activateMiddleware,
  validationMiddleware(GetPreSignedUrlDto),
  getSignedUrl
);
export const uploadRoutes = router;
