import { Router } from 'express';
import {
  getPreSignedUrl,
  uploadFile,
  uploadMultipleFile,
} from 'src/controllers/upload.controller';
import { GetPreSignedUrlDto } from 'src/dto/upload/get-presign-url.dto';
import activateMiddleware from 'src/middlewares/activate.middleware';
import requireAuthMiddleware from 'src/middlewares/require-auth.middleware';
import validationMiddleware from 'src/middlewares/validation.middleware';
import * as upload from 'src/services/multer.service';
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
 * /api/upload/upload-file:
 *  post:
 *     summary: upload file to server
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       200:
 *          description: upload file successfully
 */

router.post(
  '/upload-file',
  requireAuthMiddleware,
  activateMiddleware,
  upload.getDiskStorage().single('file'),
  uploadFile
);

/**
 * @swagger
 * /api/upload/upload-Multiple-file:
 *  post:
 *     summary: upload Multiple file to server
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *              type: object
 *              properties:
 *                files:
 *                  type: array
 *                  items:
 *                     type: string
 *                     format: binary
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       200:
 *          description: upload file successfully
 */

router.post(
  '/upload-Multiple-file',
  requireAuthMiddleware,
  activateMiddleware,
  upload.getDiskStorage().array('files', 12),
  uploadMultipleFile
);

export const uploadRoutes = router;
