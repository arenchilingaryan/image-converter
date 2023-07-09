import { Request, Response } from 'express';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { UserType } from '../../types';
import { decodeToken } from '../../utils/token';

export type RequestTypeWithUserData = Request & {
  userData?: Omit<UserType, 'password'>;
};

export const paymentRouter = async (
  req: RequestTypeWithUserData,
  res: Response
) => {
  const token = req.headers['token'] as string;

  const tokenData = decodeToken(token);
  const filePath = path.join(__dirname, '../../db/users.json');
  const dbData: UserType[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const userFromDb = dbData.find(user => user.email === tokenData.email);
  if (userFromDb?.isPaid) {
    return res.send(400).send({ error: 'Already paid' });
  }
  dbData.map(user =>
    user.email === userFromDb?.email ? { ...user, isPaid: true } : user
  );
  return null;
};
