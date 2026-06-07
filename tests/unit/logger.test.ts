import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { MockInstance } from 'vitest'
import { logger, useLogger, jsonReporter } from '../../server/utils/logger'
import type { H3Event } from 'h3'

describe('Logger Utility Test', () => {
  let stdoutWriteSpy: MockInstance<(str: string) => boolean> | undefined

  beforeEach(() => {
    stdoutWriteSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true) as unknown as MockInstance<(str: string) => boolean>
  })

  afterEach(() => {
    vi.restoreAllMocks()
    stdoutWriteSpy = undefined
  })

  // Helper to retrieve and parse stdout calls
  const getParsedLog = (callIndex = 0) => {
    const spy = stdoutWriteSpy
    if (!spy) {
      throw new Error('stdoutWriteSpy is not initialized')
    }
    const calls = spy.mock.calls
    const call = calls[callIndex]
    if (!call) {
      throw new Error(`No mock call found at index ${callIndex}`)
    }
    const raw = call[0] as string
    return JSON.parse(raw)
  }

  it('should format logs in JSON in production environment', () => {
    // Test with string message
    jsonReporter.log(
      {
        type: 'info',
        level: 3,
        tag: 'test',
        date: new Date(),
        args: ['hello world', 'extra']
      },
      { options: logger.options }
    )

    expect(stdoutWriteSpy).toHaveBeenCalled()
    const parsed = getParsedLog()

    expect(parsed.timestamp).toBeDefined()
    expect(parsed.level).toBe('INFO')
    expect(parsed.tag).toBe('test')
    expect(parsed.message).toBe('hello world extra')
  })

  it('should correctly format structured object payloads in production mode', () => {
    // Test with meta object
    jsonReporter.log(
      {
        type: 'error',
        level: 1,
        tag: 'database',
        date: new Date(),
        args: [{ userId: 'usr_456', query: 'SELECT 1' }, 'Query executed']
      },
      { options: logger.options }
    )

    const parsed = getParsedLog()

    expect(parsed.level).toBe('ERROR')
    expect(parsed.tag).toBe('database')
    expect(parsed.message).toBe('Query executed')
    expect(parsed.data).toEqual({ userId: 'usr_456', query: 'SELECT 1' })
  })

  it('should serialize error objects correctly', () => {
    const testError = new Error('Database connection failed')

    jsonReporter.log(
      {
        type: 'error',
        level: 1,
        tag: 'system',
        date: new Date(),
        args: [{ error: testError }, 'An error occurred']
      },
      { options: logger.options }
    )

    const parsed = getParsedLog()

    expect(parsed.level).toBe('ERROR')
    expect(parsed.message).toBe('An error occurred')
    expect(parsed.error).toBeDefined()
    expect(parsed.error.name).toBe('Error')
    expect(parsed.error.message).toBe('Database connection failed')
    expect(parsed.error.stack).toBeDefined()
  })

  it('should attach request context when useLogger is invoked with H3Event', () => {
    const mockEvent = {
      context: {
        requestId: 'req_12345',
        userId: 'usr_abc'
      }
    } as unknown as H3Event

    const requestLogger = useLogger(mockEvent)

    const loggerInfoSpy = vi.spyOn(logger, 'info').mockImplementation(() => {})

    requestLogger.info('Profile updated successfully')

    expect(loggerInfoSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: 'req_12345',
        userId: 'usr_abc',
        msg: 'Profile updated successfully'
      })
    )

    loggerInfoSpy.mockRestore()
  })
})
