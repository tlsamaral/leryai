import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().default(3334),
  HOST: z.string().default('0.0.0.0'),
  GOOGLE_API_KEY: z.string().min(1, 'GOOGLE_API_KEY is required'),
  GEMINI_TUTOR_MODEL: z.string().default('gemini-2.5-flash'),
  GEMINI_EVALUATOR_MODEL: z.string().default('gemini-2.5-flash'),
  LERY_API_URL: z.string().url().default('http://localhost:3333'),
  LERY_DEVICE_API_KEY: z.string().min(1, 'LERY_DEVICE_API_KEY is required'),
  TUTOR_HARD_TIMEOUT_MS: z.coerce.number().int().default(10000),
  TUTOR_MAX_RETRIES: z.coerce.number().int().default(4),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid env vars:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid env vars')
}

export const env = parsed.data
