import { Request, Response } from 'express';
import { ErrorValidationType } from '../types';

export const errorMiddleware = (
  err: ErrorValidationType,
  req: Request,
  res: Response
) => {
  res.status(err.status).send(err.message);
};
