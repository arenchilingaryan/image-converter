import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as admin from 'firebase-admin';
import { hashPassword } from '../../../utils/hashPassword';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { UserType } from '../../../types';
import { TokenData, encodeToken } from '../../../utils/token';

export const registerRouter = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const filePath = path.join(__dirname, '../../../db/users.json');
  const data: UserType[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  try {
    const { email, password } = req.body;
    const userExists = data.some(user => user.email === email);
    if (userExists) {
      return res
        .status(400)
        .send({ status: 'failure', error: 'User already exists' });
    }
    const hashedPassword = hashPassword(password);
    const newUser = await admin.auth().createUser({ email, password });
    data.push({
      email,
      password: hashedPassword,
      paymentInfo: { current: null, expired: null },
    });
    fs.writeFileSync(filePath, JSON.stringify(data));
    const encodeData: TokenData = {
      email,
      uid: newUser.uid,
    };
    const token = encodeToken(encodeData);
    return res.send({
      status: 'success',
      message: 'User registered successfully',
      token,
    });
  } catch (error) {
    return res.status(400).send({ status: 'failure', error });
  }
};
