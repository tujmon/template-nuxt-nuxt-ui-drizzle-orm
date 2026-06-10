import { z } from 'zod'

const booleanStringSchema = (defaultValue: boolean) =>
  z
    .preprocess(
      (value) => value ?? String(defaultValue),
      z.union([z.boolean(), z.enum(['true', 'false'])])
    )
    .transform((value) => value === true || value === 'true')

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(16, 'BETTER_AUTH_SECRET must have at least 16 characters'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),
  STATUS_EXPOSE_DETAILS: booleanStringSchema(false),
  RATE_LIMIT_ENABLED: booleanStringSchema(true),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(120),
  TELEMETRY_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(30)
})

export const env = serverEnvSchema.parse(process.env)

export const isProd = process.env.NODE_ENV === 'production'

export const nodeEnv = process.env.NODE_ENV || 'development'
