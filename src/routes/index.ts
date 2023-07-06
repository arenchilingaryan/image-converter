import { nanoid } from 'nanoid';
import { Request, Response } from 'express';

export const homeRouter = (req: Request, res: Response) => {
  const token = req.headers['token'] as string;

  if (!token) {
    const newToken = nanoid();
    res.send({ token: newToken });
  } else {
    res.send({ token });
  }
};
