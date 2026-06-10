import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins'
import { db } from '../database/client'
import * as schema from '../database/schema'
import { getAuthTrustedOrigins } from './auth-origin'
import { env } from './env'

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: getAuthTrustedOrigins(env.BETTER_AUTH_URL),
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [admin()]
})
