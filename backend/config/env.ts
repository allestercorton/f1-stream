import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('5000').transform(Number),
  CLIENT_URL: z.string(),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    console.error('❌ Invalid environment variables:', parsedEnv.error.format())
  );
  process.exit(1);
}

const env = parsedEnv.data;

export default env;
