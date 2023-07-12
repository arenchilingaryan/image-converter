// !!! COMPILE BEFORE USING. COMPILATION IN THE './workerConvert.js'

// eslint-disable-next-line node/no-unsupported-features/node-builtins
import { parentPort, isMainThread } from 'worker_threads';
import { FileType } from '../types';
import { convert } from './convert';

if (!parentPort || isMainThread) {
  throw new Error(
    'Parent port is not available or the script is not running inside a worker'
  );
}

parentPort.on(
  'message',
  async (data: {
    file: FileType;
    outType: 'png' | 'jpeg' | 'gif' | 'webp' | 'jpg';
    token: string;
  }) => {
    convert(data.file, data.outType, data.token, result =>
      parentPort?.postMessage(result)
    );
  }
);
