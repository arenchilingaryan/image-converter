import * as express from 'express';
import * as cors from 'cors';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import { homeRouter } from './routes';
import { uploadRouter } from './routes/upload';
import { statusRouter } from './routes/status';
import { isFilesIsImage, uploadMiddleware } from './routes/upload/guards';
import { downloadByIdRouter } from './routes/download/id';
import { envConfig } from './config/envConfig';
import { loginRouter } from './routes/auth/login';
import { check } from 'express-validator';
import { registerRouter } from './routes/auth/register';
import './db';
import { RequestTypeWithUserData, authGuard } from './utils/auth';
import { UserType } from './types';
import { paymentRouter } from './routes/payment/paymentRouter';

export const app = express();

const authCommonGuards = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password')
    .exists()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password is incorrect'),
];

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.get('/', homeRouter);

app.post('/auth/login', authCommonGuards, loginRouter);

app.post('/auth/register', authCommonGuards, registerRouter);

app.post('/payment', authGuard, paymentRouter);

app.post('/upload', authGuard, uploadMiddleware, isFilesIsImage, uploadRouter);

app.get('/status', statusRouter);

app.get('/download/:id', downloadByIdRouter);

app.listen(envConfig.PORT, () => {
  console.log(`Strarted on port ${envConfig.PORT}`);
});
