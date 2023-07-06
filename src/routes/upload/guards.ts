import { NextFunction, Request, Response } from 'express';
import * as multer from 'multer';
import { RequestFileType } from '../../types';
import { fileIsImage } from '../../utils/fileIsImage';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.array('file')(req, res, err => {
    if (err) {
      res.status(400).json({ error: 'File should be less then 50mb' });
    } else {
      next();
    }
  });
};

export const isFilesIsImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as RequestFileType[];
  if (!files || files.length === 0) {
    res.sendStatus(400);
  }
  const nonImageFiles: RequestFileType[] = files.filter(
    file => !fileIsImage(file.mimetype)
  );
  if (nonImageFiles.length > 0) {
    const names = nonImageFiles.map(file => file.originalname).join(', ');
    res.send({ error: `${names} is not an images` });
  } else {
    next();
  }
};
