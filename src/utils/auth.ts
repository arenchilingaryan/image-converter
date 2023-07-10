import { NextFunction, Response } from 'express';
import { RequestTypeWithUserData, UserType } from '../types';
import { decodeToken } from './token';
import * as fs from 'node:fs';
import * as path from 'node:path';

export const authGuard = async (
  req: RequestTypeWithUserData,
  _: Response,
  next: NextFunction
) => {
  const token = req.headers['token'] as string;

  const tokenData = decodeToken(token);
  const filePath = path.join(__dirname, '../db/users.json');
  const dbData: UserType[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const userFromDb = dbData.find(user => user.email === tokenData?.email);

  if (userFromDb) {
    req.userData = {
      email: tokenData?.email || '',
      paymentInfo: userFromDb.paymentInfo,
    };
  }

  next();
};
