import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string(),
  SECRET_KEY: z.string(),
});

export const envConfig = envSchema.parse(process.env);
