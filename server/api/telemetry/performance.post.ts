import { env } from '#server/utils/env'
import { useLogger } from '#server/utils/logger'
import { assertRateLimit } from '#server/utils/rate-limit'
import { performanceMeasureSchema } from '#shared/validation/performance'

export default defineEventHandler(async (event) => {
  const loggerInstance = useLogger(event)

  assertRateLimit(event, {
    keyPrefix: 'telemetry:performance',
    maxRequests: env.TELEMETRY_RATE_LIMIT_MAX_REQUESTS
  })

  const body = await readValidatedBody(event, (value) => {
    const result = performanceMeasureSchema.safeParse(value)
    if (!result.success) {
      loggerInstance.warn({ errors: result.error.format() }, 'Invalid telemetry payload received')
      throw createError({
        status: 400,
        message: 'Métrica de performance inválida',
        data: result.error.format()
      })
    }
    return result.data
  })

  loggerInstance.info(
    { name: body.name, duration: body.duration },
    `Performance metric received: ${body.name}`
  )

  return {
    success: true
  }
})
