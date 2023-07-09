import * as jwt from 'jsonwebtoken';
import { envConfig } from '../config/envConfig';

export type TokenData = {
  uid: string;
  email: string;
};

export const encodeToken = (data: TokenData) => {
  const a = jwt.sign(data, envConfig.SECRET_KEY, { algorithm: 'HS256' });
  return a;
};

export const decodeToken = (token: string) =>
  jwt.verify(token, envConfig.SECRET_KEY) as TokenData;
