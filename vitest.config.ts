import { defineConfig } from 'vitest/config'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

const testEnvPath = resolve(__dirname, '.env.test')
const testEnv = existsSync(testEnvPath)
  ? Object.fromEntries(
      readFileSync(testEnvPath, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map((line) => {
          const [key, ...valueParts] = line.split('=')
          const value = valueParts.join('=').replace(/^"|"$/g, '')
          return [key, value]
        })
    )
  : {}

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    env: {
      DATABASE_URL: process.env.DATABASE_URL || testEnv.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/db',
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || testEnv.BETTER_AUTH_SECRET || 'test-secret-random-key',
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || testEnv.BETTER_AUTH_URL || 'http://localhost:3000',
      STATUS_EXPOSE_DETAILS: process.env.STATUS_EXPOSE_DETAILS || testEnv.STATUS_EXPOSE_DETAILS || 'true',
      RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED || testEnv.RATE_LIMIT_ENABLED || 'false',
      RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || testEnv.RATE_LIMIT_WINDOW_MS || '60000',
      RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || testEnv.RATE_LIMIT_MAX_REQUESTS || '120',
      TELEMETRY_RATE_LIMIT_MAX_REQUESTS: process.env.TELEMETRY_RATE_LIMIT_MAX_REQUESTS || testEnv.TELEMETRY_RATE_LIMIT_MAX_REQUESTS || '30'
    }
  },
  resolve: {
    alias: {
      '~~': resolve(__dirname, './'),
      '~': resolve(__dirname, './')
    }
  }
})
