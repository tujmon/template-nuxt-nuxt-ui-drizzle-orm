import { env } from '~~/server/utils/env'
import { useLogger } from '~~/server/utils/logger'
import { assertRateLimit } from '~~/server/utils/rate-limit'
import { performanceMeasureSchema } from '~~/shared/validation/performance'

export default defineEventHandler(async (event) => {
  const loggerInstance = useLogger(event)

  assertRateLimit(event, {
    keyPrefix: 'telemetry:performance',
    maxRequests: env.TELEMETRY_RATE_LIMIT_MAX_REQUESTS
  })

  const body = await readBody(event)
  const result = performanceMeasureSchema.safeParse(body)

  if (!result.success) {
    loggerInstance.warn({ errors: result.error.format() }, 'Invalid telemetry payload received')
    throw createError({
      statusCode: 400,
      message: 'Métrica de performance inválida',
      data: result.error.format()
    })
  }

  loggerInstance.info(
    { name: result.data.name, duration: result.data.duration },
    `Performance metric received: ${result.data.name}`
  )

  return {
    success: true
  }
})
