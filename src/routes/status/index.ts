import { Request, Response } from 'express';
import { queueService } from '../../utils/queue';
import { files } from '../../utils/convert';

export const statusRouter = (req: Request, res: Response) => {
  const token = req.headers['token'] as string;
  const completesData = files.filter(file => file.token === token);
  const data = queueService.getUserData(token);
  res.send({ data: { ...data, ...completesData } });
};
