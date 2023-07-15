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
import { authGuard } from './middlewares/auth';
import { paymentRouter } from './routes/payment/paymentRouter';
import { paymentGuard } from './routes/payment/paymentGuard';
import './db';
import { authCommonGuards } from './middlewares/authGuards';
import { errorMiddleware } from './middlewares/error';

export const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.get('/', homeRouter);

app.post('/auth/login', authCommonGuards, loginRouter);

app.post('/auth/register', authCommonGuards, registerRouter);

app.post('/payment', authGuard, paymentGuard, paymentRouter);

app.post('/upload', authGuard, uploadMiddleware, isFilesIsImage, uploadRouter);

app.get('/status', authGuard, statusRouter);

app.get('/download/:id', downloadByIdRouter);

app.use(errorMiddleware);

app.listen(envConfig.PORT, () => {
  console.log(`Strarted on port ${envConfig.PORT}`);
});
