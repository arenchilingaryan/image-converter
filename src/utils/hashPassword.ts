import * as crypto from 'crypto';
import { envConfig } from '../config/envConfig';

const secretKey = envConfig.SECRET_KEY;

export function hashPassword(password: string) {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(password);
  return hmac.digest('hex');
}
