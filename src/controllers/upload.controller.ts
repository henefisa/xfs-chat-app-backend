import { NextFunction, Response } from 'express';
import { GetPreSignedUrlDto } from 'src/dto/upload/get-presign-url.dto';
import { RequestWithBody } from 'src/shares';
import * as S3Service from 'src/services/s3.service';
import { StatusCodes } from 'http-status-codes';
import { NotFoundException } from 'src/exceptions';

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

export const uploadFile = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;
    if (!file) {
      throw new NotFoundException('file');
    }
    return res.status(StatusCodes.OK).json(file);
  } catch (error) {
    next(error);
  }
};

export const uploadMultipleFile = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files;
    if (!files) {
      throw new NotFoundException('files');
    }
    return res.status(StatusCodes.OK).json(files);
  } catch (error) {
    next(error);
  }
};
