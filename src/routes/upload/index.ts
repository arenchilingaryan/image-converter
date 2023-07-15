import { Response } from 'express';
import { queueService } from '../../utils/queue';
import { RequestFileType, RequestTypeWithUserData } from '../../types';
import { convertFilesObject } from '../../utils/convertFilesObject';
import { processingForPaidUser } from './processingForPaidUser';

export const uploadRouter = async (
  req: RequestTypeWithUserData,
  res: Response
) => {
  const files = req.files as RequestFileType[];
  const token = req.headers['token'] as string;
  const { inType, outType, width, height } = req.body;
  const userData = req.userData;
  if (userData) {
    if (!userData?.paymentInfo.current) {
      if (outType === 'webp' || files.length > 5) {
        return res.status(400).send({
          error:
            'Upgrade your status for processing more than two files or convert files to webp',
        });
      }
    }
  } else {
    if (files.length > 2 || outType === 'webp') {
      return res.status(400).send({
        error: 'Sign in to system for processing more than two files',
      });
    }
  }

  const newFiles = convertFilesObject(
    files,
    token,
    inType,
    outType,
    height,
    width
  );

  if (userData) {
    if (userData.paymentInfo.expired) {
      processingForPaidUser(userData, newFiles, outType, token);
    } else {
      queueService.add(newFiles, outType, res);
    }
  } else {
    queueService.add(newFiles, outType, res);
  }

  return res.send({ message: 'Files successfully uploaded' });
};
