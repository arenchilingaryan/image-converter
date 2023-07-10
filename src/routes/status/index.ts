import { Response } from 'express';
import { queueService } from '../../utils/queue';
import { files } from '../../utils/convert';
import { RequestTypeWithUserData } from '../../types';
import * as fs from 'node:fs';

export const statusRouter = (req: RequestTypeWithUserData, res: Response) => {
  const token = req.headers['token'] as string;
  const userData = req.userData;

  const completesData = files.filter(file => file.token === token);
  const data = queueService.getUserData(token);

  if (userData?.email && userData.paymentInfo.expired) {
    const dateNow = new Date();
    const expiredDate = new Date(userData.paymentInfo.expired);
    const diff = expiredDate.getTime() - dateNow.getTime();

    if (diff > 0) {
      const dirPath = `../../db/paidFiles/${userData.email}.json`;
      const personalData = fs.readFileSync(dirPath, 'utf8');
      return res.status(200).send({ data: personalData });
    }
    return res.status(200).send({ data: { ...data, ...completesData } });
  }
  return res.status(200).send({ data: { ...data, ...completesData } });
};
