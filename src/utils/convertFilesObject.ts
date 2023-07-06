import { ConvertFilesObjectType, FileType, RequestFileType } from '../types';
import * as crypto from 'crypto';
import * as fs from 'node:fs';

function hashFile(file: RequestFileType) {
  const data = fs.readFileSync(file.path);
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

export const convertFilesObject: ConvertFilesObjectType = (
  files,
  token,
  inType,
  outType,
  height,
  width
) => {
  return files.map(file => {
    const hash =
      hashFile(file) + inType + outType + width + height + file.filename;
    const obj: FileType = {
      token,
      inType,
      outType,
      file,
      hash,
      status: 'waiting',
      name: file.filename,
    };
    if (width) obj.width = Number(width);
    if (width) obj.height = Number(height);
    return obj;
  });
};
