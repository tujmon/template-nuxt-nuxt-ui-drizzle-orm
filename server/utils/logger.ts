import { type ConsolaInstance, type ConsolaReporter, createConsola, type LogObject } from 'consola'
import type { H3Event } from 'h3'
import { isProd } from './env'

// Custom JSON reporter for production structured logging
export const jsonReporter: ConsolaReporter = {
  log(logObj: LogObject) {
    const payload: unknown = logObj.args[0]
    const msgArgs: unknown[] = logObj.args.slice(1)

    const logEntry: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level: logObj.type.toUpperCase(),
      tag: logObj.tag || 'app'
    }

    if (typeof payload === 'string') {
      logEntry.message = [payload, ...msgArgs].join(' ')
    } else if (payload instanceof Error) {
      logEntry.message = payload.message
      logEntry.error = {
        name: payload.name,
        message: payload.message,
        stack: payload.stack
      }
      if (msgArgs.length > 0) {
        logEntry.message_detail = msgArgs.join(' ')
      }
    } else if (typeof payload === 'object' && payload !== null) {
      // First argument is metadata object
      const meta = payload as Record<string, unknown>
      logEntry.message = msgArgs.join(' ') || (meta.message as string) || 'Structured log'
      logEntry.data = { ...meta }
      delete (logEntry.data as Record<string, unknown>).message // Avoid duplication if present

      // Standardize error serialization if present
      if (meta.error instanceof Error) {
        logEntry.error = {
          name: meta.error.name,
          message: meta.error.message,
          stack: meta.error.stack
        }
        delete (logEntry.data as Record<string, unknown>).error
      }
    } else {
      logEntry.message = logObj.args.join(' ')
    }

    process.stdout.write(`${JSON.stringify(logEntry)}\n`)
  }
}

export const logger: ConsolaInstance = createConsola({
  level: isProd ? 3 : 4, // Info level in production, Debug level in development
  reporters: isProd ? [jsonReporter] : undefined // consola's default pretty reporter in dev
})

// Request-scoped logger helper to easily attach request context details
export const useLogger = (event?: H3Event) => {
  if (!event?.context) {
    return logger
  }

  const requestId: unknown = event.context.requestId
  const userId: unknown = event.context.userId || event.context.session?.user?.id

  const formatPayload = (payload: unknown) => {
    const payloadObj =
      typeof payload === 'object' && payload !== null
        ? (payload as Record<string, unknown>)
        : { msg: payload }

    return {
      requestId,
      userId,
      ...payloadObj
    }
  }

  return {
    info: (payload: unknown, ...args: unknown[]) => {
      logger.info(formatPayload(payload), ...args)
    },
    warn: (payload: unknown, ...args: unknown[]) => {
      logger.warn(formatPayload(payload), ...args)
    },
    error: (payload: unknown, ...args: unknown[]) => {
      logger.error(formatPayload(payload), ...args)
    },
    debug: (payload: unknown, ...args: unknown[]) => {
      logger.debug(formatPayload(payload), ...args)
    }
  }
}
