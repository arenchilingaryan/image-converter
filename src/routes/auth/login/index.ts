import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as admin from 'firebase-admin';
import { hashPassword } from '../../../utils/hashPassword';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { UserType } from '../../../types';
import { TokenData, encodeToken } from '../../../utils/token';

export const loginRouter = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const filePath = path.join(__dirname, '../../../db/users.json');
  const data: UserType[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  try {
    const { email, password } = req.body;
    const user = await admin.auth().getUserByEmail(email);
    const hashedPassword = hashPassword(password);

    if (user) {
      const dbUser = data.find(x => x.password === hashedPassword);

      if (dbUser?.password === hashedPassword) {
        const encodeData: TokenData = {
          email: dbUser.email,
          uid: user.uid,
        };
        const token = encodeToken(encodeData);
        return res.send({ status: 'success', token });
      }
      return res.send({ status: 'failure', error: 'Something went wrong' });
    }
  } catch (error) {
    return res.send({ status: 'failure', error });
  }

  return null;
};
