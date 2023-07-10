import { parentPort } from 'node:worker_threads';
import { FileType } from '../../types';
import { convert } from '../../utils/convert';

if (!parentPort) {
  throw new Error('Parent port is not available');
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
