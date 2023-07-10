import { Response } from 'express';
import { queueService } from '../../utils/queue';
import {
  RequestFileType,
  RequestTypeWithUserData,
  ResultFileType,
} from '../../types';
import { convertFilesObject } from '../../utils/convertFilesObject';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Worker } from 'node:worker_threads';

export const uploadRouter = (req: RequestTypeWithUserData, res: Response) => {
  const files = req.files as RequestFileType[];
  const token = req.headers['token'] as string;
  const { inType, outType, width, height } = req.body;
  const userData = req.userData;

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
        const dirPath = `../../db/paidFiles/${userData.email}.json`;
        try {
          files = JSON.parse(fs.readFileSync(dirPath, 'utf8'));
        } catch (err) {
          console.log('files not recognized');
        }
        if (!files) {
          fs.writeFileSync(dirPath, JSON.stringify(newFiles));
        } else {
          files.push(...newFiles);
        }
        newFiles.forEach(file => {
          const worker = new Worker(path.join(__dirname, './convertWorker.js'));
          worker.postMessage({
            file: file,
            outType: outType,
            token: token,
          });
          worker.on('message', (data: ResultFileType) => {
            files.map((file: any) => {
              if (data.hash === file.hash) {
                return data;
              }
              return file;
            });
            worker.terminate();
          });
          worker.on('error', console.error);
          worker.on('error', error => {
            console.error(error);
            worker.terminate();
          });
        });
      }
    } else {
      queueService.add(newFiles, outType, res);
    }
  } else {
    queueService.add(newFiles, outType, res);
  }

  res.send({ message: 'Files successfully uploaded' });
};
