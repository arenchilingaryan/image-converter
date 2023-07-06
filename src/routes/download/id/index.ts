import { Request, Response } from 'express';

export const downloadByIdRouter = (req: Request, res: Response) => {
  if (req.params.id) {
    res.download(req.params.id);
  } else {
    res.sendStatus(404).send('Not found');
  }
};
