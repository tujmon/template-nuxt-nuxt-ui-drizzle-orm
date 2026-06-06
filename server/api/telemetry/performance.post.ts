import { performanceMeasureSchema } from '~~/shared/validation/performance'
import { env } from '~~/server/utils/env'
import { assertRateLimit } from '~~/server/utils/rate-limit'

export default defineEventHandler(async (event) => {
  assertRateLimit(event, {
    keyPrefix: 'telemetry:performance',
    maxRequests: env.TELEMETRY_RATE_LIMIT_MAX_REQUESTS
  })

  assertMethod(event, 'POST')

  const body = await readBody(event)
  const result = performanceMeasureSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Métrica de performance inválida',
      data: result.error.format()
    })
  }

  return {
    success: true
  }
})
