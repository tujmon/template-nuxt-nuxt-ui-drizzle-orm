import { env } from './env'

type RateLimitOptions = {
  keyPrefix: string
  maxRequests?: number
  windowMs?: number
}

type RateLimitEntry = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitEntry>()

const CLEANUP_INTERVAL_MS = 60_000
let lastCleanupAt = Date.now()

const cleanupExpiredBuckets = () => {
  const now = Date.now()
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) {
    return
  }

  lastCleanupAt = now

  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) {
      buckets.delete(key)
    }
  }
}

const getClientIp = (event: Parameters<typeof getRequestIP>[0]) => {
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}

export const assertRateLimit = (
  event: Parameters<typeof getRequestIP>[0],
  options: RateLimitOptions
) => {
  if (!env.RATE_LIMIT_ENABLED) {
    return
  }

  cleanupExpiredBuckets()

  const now = Date.now()
  const windowMs = options.windowMs ?? env.RATE_LIMIT_WINDOW_MS
  const maxRequests = options.maxRequests ?? env.RATE_LIMIT_MAX_REQUESTS
  const key = `${options.keyPrefix}:${getClientIp(event)}`
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs
    })
    return
  }

  current.count += 1

  if (current.count > maxRequests) {
    throw createError({
      statusCode: 429,
      message: 'Muitas requisições. Tente novamente mais tarde.'
    })
  }
}
