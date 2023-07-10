import { Request } from 'express';

export type RequestFileType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export type FileType = {
  token: string;
  inType: string;
  outType: string;
  file: any;
  hash: string;
  name: string;
  width?: number;
  height?: number;
  status: 'waiting' | 'complete';
};

export type ConvertFilesObjectType = (
  files: RequestFileType[],
  token: string,
  inType: string,
  outType: string,
  height: string,
  width: string
) => FileType[];

export type ResultFileType = FileType & {
  fileName: string;
  token: string;
};

export type UserType = {
  email: string;
  password: string;
  paymentInfo: {
    expired: Date | null;
    current: 'month' | 'year' | null;
  };
};

export type RequestTypeWithUserData = Request & {
  userData?: Omit<UserType, 'password'>;
};
