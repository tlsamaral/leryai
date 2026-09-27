// Runs before eval test files are imported.
// Loads .env if present (local dev with real keys).
// Falls back to dummy values so env.ts does not throw on import — tests then skip.
import { config } from 'dotenv'

config()

if (!process.env.GOOGLE_API_KEY) process.env.GOOGLE_API_KEY = '__dummy__'
if (!process.env.LERY_DEVICE_API_KEY)
  process.env.LERY_DEVICE_API_KEY = '__dummy__'
