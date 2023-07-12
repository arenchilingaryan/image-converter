import { Worker } from 'node:worker_threads';
import { FileType, ResultFileType } from '../types';
import * as path from 'node:path';

type DataType = {
  file: FileType;
  outType: string;
  token: string;
};

export const processingByThread = <T = ResultFileType>(
  data: DataType,
  cb: (data: T, worker: any) => void
) => {
  const worker = new Worker(path.join(__dirname, './workerConvert.js'));
  worker.postMessage({
    file: data.file,
    outType: data.outType,
    token: data.token,
  });
  worker.on('message', async (data: T) => cb(data, worker));
  worker.on('error', console.error);
  worker.on('error', error => {
    console.error(error);
    worker.terminate();
  });
};
