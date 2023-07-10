import { NextFunction, Response } from 'express';
import { RequestTypeWithUserData } from '../../types';

export const paymentGuard = (
  req: RequestTypeWithUserData,
  res: Response,
  next: NextFunction
) => {
  const paymentCount = req.body.paymentCount;
  const isAuthenticated = !!req.userData?.email;
  if (!isAuthenticated) {
    res
      .send(400)
      .send({ error: 'Payment Failed. Please log in to your account' });
  }
  if (paymentCount === 20 || paymentCount === 164) {
    return next();
  }
  return res
    .send(400)
    .send({ error: 'Payment Failed. Please fill the correct amount of money' });
};
