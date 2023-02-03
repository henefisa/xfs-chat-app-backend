import { Request } from 'express';
import multer from 'multer';

export const getDiskStorage = () => {
  const storage = multer.diskStorage({
    destination: function (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void
    ) {
      callback(null, './uploads');
    },

    filename: function (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void
    ) {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      callback(null, fileName);
    },
  });

  return multer({
    storage: storage,
    limits: {
      fileSize: 25000000,
    },
  });
};
