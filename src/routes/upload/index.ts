import { Request, Response } from 'express';
import { queueService } from '../../utils/queue';
import { RequestFileType } from '../../types';
import { convertFilesObject } from '../../utils/convertFilesObject';

export const uploadRouter = (req: Request, res: Response) => {
  const files = req.files as RequestFileType[];
  const token = req.headers['token'] as string;
  const { inType, outType, width, height } = req.body;

  const newFiles = convertFilesObject(
    files,
    token,
    inType,
    outType,
    height,
    width
  );
  queueService.add(newFiles, outType, res);
  res.send({ message: 'Files successfully uploaded' });
};
