import type { H3Event } from 'h3'
import { useLogger } from '../utils/logger'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error: Error, { event }: { event?: H3Event }) => {
    // Obtain request-scoped logger to preserve requestId
    const requestLogger = useLogger(event)

    requestLogger.error(
      {
        message: error.message || 'Unhandled server error',
        error
      },
      'Unhandled server-side exception'
    )
  })
})
