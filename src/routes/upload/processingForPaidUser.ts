import { FileType, ResultFileType } from '../../types';
import { processingByThread } from '../../utils/mainThread';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

type UserDataType = {
  email: string;
  paymentInfo: {
    expired: Date | null;
    current: 'month' | 'year' | null;
  };
};

export async function processingForPaidUser(
  userData: UserDataType,
  newFiles: FileType[],
  outType: string,
  token: string
) {
  if (userData) {
    const dateNow = new Date();
    const expiredDate = new Date(userData.paymentInfo.expired || 0);
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
      for (const file of newFiles) {
        processingByThread(
          { file, outType, token },
          async (data: ResultFileType, worker: any) => {
            const newFilesForPaidMember = files.map((file: any) => {
              if (data.hash === file.hash) {
                return data;
              }
              return file;
            });
            await fs.writeFile(dirPath, JSON.stringify(newFilesForPaidMember));
            worker.terminate();
          }
        );
      }
    }
  }
}
