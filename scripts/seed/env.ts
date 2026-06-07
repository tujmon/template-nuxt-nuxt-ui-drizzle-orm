import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { SeedConfig } from './types'

const loadEnvFile = (filePath: string) => {
  if (!existsSync(filePath)) {
    return
  }

  const lines = readFileSync(filePath, 'utf8').split('\n')

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue
    }

    const [key, ...valueParts] = trimmedLine.split('=')

    if (!key || process.env[key]) {
      continue
    }

    process.env[key] = valueParts.join('=').replace(/^"|"$/g, '')
  }
}

export const loadSeedEnv = () => {
  loadEnvFile(resolve(process.cwd(), process.env.SEED_ENV_FILE || '.env'))

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run seed scripts.')
  }

  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    throw new Error('Refusing to run seed in production. Set ALLOW_PRODUCTION_SEED=true to override.')
  }
}

export const getSeedConfig = (): SeedConfig => {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to build seed config.')
  }

  const getEnv = (key: string, fallback: string) => process.env[key] || fallback

  return {
    databaseUrl,
    demoUser: {
      id: getEnv('SEED_USER_ID', 'seed_user_demo'),
      accountId: getEnv('SEED_ACCOUNT_ID', 'seed_account_demo'),
      email: getEnv('SEED_USER_EMAIL', 'demo@example.com'),
      name: getEnv('SEED_USER_NAME', 'Demo User'),
      password: getEnv('SEED_USER_PASSWORD', 'password123'),
      role: 'user'
    },
    adminUser: {
      id: getEnv('SEED_ADMIN_ID', 'seed_user_admin'),
      accountId: getEnv('SEED_ADMIN_ACCOUNT_ID', 'seed_account_admin'),
      email: getEnv('SEED_ADMIN_EMAIL', 'admin@example.com'),
      name: getEnv('SEED_ADMIN_NAME', 'Admin User'),
      password: getEnv('SEED_ADMIN_PASSWORD', 'admin123'),
      role: 'admin'
    }
  }
}
