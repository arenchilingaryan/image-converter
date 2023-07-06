import * as sharp from 'sharp';
import { FileType, ResultFileType } from '../types';

export const files: ResultFileType[] = [];

export const convert = async (
  file: FileType,
  outType: 'png' | 'jpeg' | 'gif' | 'webp' | 'jpg',
  token: string
) => {
  const name = file.file.originalname.split('.').shift();
  const out = outType === 'jpg' ? 'jpeg' : outType;

  const fileName = `${name}.${out}`;

  if (file.width && file.height) {
    await sharp(file.file.path)
      [out]()
      .resize(file.width, file.height)
      .toFile(fileName);
  }

  if (file.width && !file.height) {
    await sharp(file.file.path)[out]().resize(file.width).toFile(fileName);
  }

  if (!file.width && !file.height) {
    await sharp(file.file.path)[out]().toFile(fileName);
  }

  files.push({
    ...file,
    fileName,
    token,
    status: 'complete',
  });
};
