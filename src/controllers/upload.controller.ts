import { NextFunction, Response } from 'express';
import { GetPreSignedUrlDto } from 'src/dto/upload/get-presign-url.dto';
import { RequestWithBody } from 'src/shares';
import * as S3Service from 'src/services/s3.service';
import { StatusCodes } from 'http-status-codes';

export const getPreSignedUrl = async (
  req: RequestWithBody<GetPreSignedUrlDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const presigned = S3Service.getPreSignedUrl(req.body.key);

    return res.status(StatusCodes.OK).json(presigned);
  } catch (error) {
    next(error);
  }
};
