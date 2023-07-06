import * as crypto from 'crypto';
import * as fs from 'node:fs';
import { RequestFileType } from '../types';
import { convertFilesObject } from './convertFilesObject';

jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('mocked_hash'),
  }),
}));

jest.mock('node:fs', () => ({
  readFileSync: jest.fn().mockReturnValue('mocked_file_data'),
}));

describe('convertFilesObject', () => {
  it('should convert files object', () => {
    const mockFile = {
      path: '/path/to/file',
      filename: 'test.jpg',
      destination: '',
      encoding: '',
      fieldname: '',
      mimetype: '',
      originalname: '',
      size: 2313,
    } as RequestFileType;

    const files = [mockFile];
    const token = 'mockToken';
    const inType = 'jpeg';
    const outType = 'png';
    const width = '800';
    const height = '600';

    const result = convertFilesObject(
      files,
      token,
      inType,
      outType,
      height,
      width
    );

    expect(result[0].token).toEqual(token);
    expect(result[0].inType).toEqual(inType);
    expect(result[0].outType).toEqual(outType);
    expect(result[0].file).toEqual(mockFile);
    expect(result[0].hash).toContain('mocked_hash');
    expect(result[0].status).toEqual('waiting');
    expect(result[0].name).toEqual(mockFile.filename);
    expect(result[0].width).toEqual(Number(width));
    expect(result[0].height).toEqual(Number(height));

    expect(crypto.createHash).toHaveBeenCalledWith('sha256');
    expect(fs.readFileSync).toHaveBeenCalledWith(mockFile.path);
  });
});
