import { getRequestIP } from 'h3'
import { logger } from '../utils/logger'

export default defineEventHandler((event) => {
  const start = Date.now()
  const method = event.node.req.method || 'GET'
  const url = event.node.req.url || '/'
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  // Generate a unique request ID and store it in context
  const requestId = crypto.randomUUID()
  event.context.requestId = requestId

  logger.debug({ requestId, method, url, ip }, `Incoming request: ${method} ${url}`)

  event.node.res.on('finish', () => {
    const duration = Date.now() - start
    const statusCode = event.node.res.statusCode

    // Read userId from context if it was set by handlers or auth during request execution
    const userId = event.context.userId || event.context.session?.user?.id || null

    logger.info(
      {
        requestId,
        method,
        url,
        ip,
        statusCode,
        durationMs: duration,
        userId
      },
      `${method} ${url} finished with status ${statusCode} in ${duration}ms`
    )
  })
})
