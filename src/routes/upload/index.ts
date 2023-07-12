import { Response } from 'express';
import { queueService } from '../../utils/queue';
import {
  RequestFileType,
  RequestTypeWithUserData,
  ResultFileType,
} from '../../types';
import { convertFilesObject } from '../../utils/convertFilesObject';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { processingByThread } from '../../utils/mainThread';

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
      const dateNow = new Date();
      const expiredDate = new Date(userData.paymentInfo.expired);
      const diff = expiredDate.getTime() - dateNow.getTime();
      if (diff > 0) {
        let files: any = undefined;
        const dirPath = path.join(
          __dirname,
          `../../db/paidFiles/${userData.email}.json`
        );
        try {
          files = JSON.parse(await fs.readFile(dirPath, 'utf8'));
        } catch (error: any) {
          if (error.code === 'ENOENT') {
            files = [];
          } else {
            throw error;
          }
        }
        files.push(...newFiles);
        newFiles.forEach(file => {
          processingByThread(
            { file, outType, token },
            async (data: ResultFileType, worker: any) => {
              const newFilesForPaidMember = files.map((file: any) => {
                if (data.hash === file.hash) {
                  return data;
                }
                return file;
              });
              await fs.writeFile(
                dirPath,
                JSON.stringify(newFilesForPaidMember)
              );
              worker.terminate();
            }
          );
        });
      }
    } else {
      queueService.add(newFiles, outType, res);
    }
  } else {
    queueService.add(newFiles, outType, res);
  }

  return res.send({ message: 'Files successfully uploaded' });
};
