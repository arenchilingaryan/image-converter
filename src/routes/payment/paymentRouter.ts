import { Response } from 'express';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { RequestTypeWithUserData, UserType } from '../../types';
import { decodeToken } from '../../utils/token';

function getNewData(
  data: UserType[],
  expired: Date,
  email: string,
  paymentCount: number
) {
  return data.map(user =>
    user.email === email
      ? {
          ...user,
          paymentInfo: {
            current: paymentCount,
            expired,
          },
        }
      : user
  );
}

export const paymentRouter = async (
  req: RequestTypeWithUserData,
  res: Response
) => {
  const token = req.headers['token'] as string;

  const tokenData = decodeToken(token);
  const filePath = path.join(__dirname, '../../db/users.json');
  const dbData: UserType[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const userFromDb = dbData.find(user => user.email === tokenData?.email);

  const daysPrime = req.body.paymentCount === 20 ? 30 : 365;

  const baseDate = userFromDb?.paymentInfo.expired
    ? new Date(userFromDb.paymentInfo.expired)
    : new Date();

  baseDate.setDate(baseDate.getDate() + daysPrime);

  const newData = getNewData(
    dbData,
    baseDate,
    userFromDb?.email || '',
    req.body.paymentCount
  );

  fs.writeFileSync(filePath, JSON.stringify(newData));
  return res.status(200).send('Successful');
};
