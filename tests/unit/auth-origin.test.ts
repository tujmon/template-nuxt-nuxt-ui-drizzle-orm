import { describe, expect, it } from 'vitest'
import { getAuthTrustedOrigins } from '../../server/utils/auth-origin'

describe('Better Auth trusted origins', () => {
  it('derives the trusted origin from BETTER_AUTH_URL', () => {
    expect(getAuthTrustedOrigins('https://app.example.com/auth')).toEqual([
      'https://app.example.com'
    ])
  })

  it('preserves the configured local development port', () => {
    expect(getAuthTrustedOrigins('http://localhost:3001')).toEqual([
      'http://localhost:3001'
    ])
  })
})
