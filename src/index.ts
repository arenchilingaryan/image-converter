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

export const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.get('/', homeRouter);

app.post('/upload', uploadMiddleware, isFilesIsImage, uploadRouter);

app.get('/status', statusRouter);

app.get('/download/:id', downloadByIdRouter);

app.listen(envConfig.PORT, () => {
  console.log(`Strarted on port ${envConfig.PORT}`);
});
