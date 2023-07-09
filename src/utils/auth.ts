import { NextFunction, Request, Response } from 'express';
import { UserType } from '../types';
import { decodeToken } from './token';
import * as fs from 'node:fs';
import * as path from 'node:path';

export type RequestTypeWithUserData = Request & {
  userData?: Omit<UserType, 'password'>;
};

export const authGuard = async (
  req: RequestTypeWithUserData,
  _: Response,
  next: NextFunction
) => {
  const token = req.headers['token'] as string;

  const tokenData = decodeToken(token);
  const filePath = path.join(__dirname, '../db/users.json');
  const dbData: UserType[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const userFromDb = dbData.find(user => user.email === tokenData.email);

  if (userFromDb) {
    req.userData = {
      email: tokenData.email,
      isPaid: userFromDb.isPaid,
    };
  }

  next();
};
