import { setup, fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

await setup({
  rootDir: process.cwd(),
  server: true,
  browser: false,
  build: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    STATUS_EXPOSE_DETAILS: process.env.STATUS_EXPOSE_DETAILS,
    RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
    TELEMETRY_RATE_LIMIT_MAX_REQUESTS: process.env.TELEMETRY_RATE_LIMIT_MAX_REQUESTS
  }
})

describe('API routes', () => {
  it('returns application dependency status', async () => {
    const response = await fetch('/api/v1/status')
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.updated_at).toEqual(expect.any(String))
    expect(body.dependencies.database.status).toBe('ok')
    expect(body.dependencies.database.version).toEqual(expect.any(String))
    expect(body.dependencies.database.max_connections).toEqual(expect.any(Number))
    expect(body.dependencies.database.opened_connections).toEqual(expect.any(Number))
  })

  it('requires authentication before updating a profile', async () => {
    const response = await fetch('/api/v1/users/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'Sem Sessão' })
    })

    expect(response.status).toBe(401)
  })

  it('validates telemetry payloads with Zod', async () => {
    const response = await fetch('/api/telemetry/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })

    expect(response.status).toBe(400)
  })

  it('accepts valid telemetry payloads', async () => {
    const response = await fetch('/api/telemetry/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'test.action',
        duration: 42,
        thresholdMs: 100,
        exceededThreshold: false,
        createdAt: new Date().toISOString()
      })
    })

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
  })
})
