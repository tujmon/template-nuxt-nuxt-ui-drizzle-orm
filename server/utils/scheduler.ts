import { db } from '../database/client'
import { schedulerTask } from '../database/schema/scheduler'
import { eq, and, or, isNull, lt } from 'drizzle-orm'
import { logger } from './logger'
import { nodeEnv } from './env'

export interface TaskResult<T> {
  success: boolean
  durationMs: number
  data?: T
  error?: string
}

const DEFAULT_STALE_TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes

export async function runTaskWithGuardrails<T>(
  taskName: string,
  taskFn: () => Promise<T>,
  options: {
    staleTimeoutMs?: number
    allowedEnvironments?: string[]
  } = {}
): Promise<TaskResult<T>> {
  const start = Date.now()
  const allowedEnvs = options.allowedEnvironments || ['production', 'development', 'test']
  const currentEnv = nodeEnv

  // 1. Environment check
  if (!allowedEnvs.includes(currentEnv)) {
    logger.warn({ taskName, currentEnv }, `Task skipped: environment '${currentEnv}' not allowed`)
    return {
      success: false,
      durationMs: 0,
      error: `Environment '${currentEnv}' not allowed`
    }
  }

  const staleTimeout = options.staleTimeoutMs || DEFAULT_STALE_TIMEOUT_MS
  const now = new Date()
  const staleTime = new Date(now.getTime() - staleTimeout)

  let lockAcquired = false

  try {
    // 2. Concurrency lock check using atomic update
    // Check if task row exists, create if missing
    const existing = await db.select().from(schedulerTask).where(eq(schedulerTask.name, taskName)).limit(1)
    if (existing.length === 0) {
      try {
        await db.insert(schedulerTask).values({
          name: taskName,
          lockedAt: null
        })
      } catch {
        // Row might have been inserted concurrently by another server instance, ignore
      }
    }

    // Try to acquire lock atomically. We return the name column to check if updated
    const updatedRows = await db
      .update(schedulerTask)
      .set({ lockedAt: now })
      .where(
        and(
          eq(schedulerTask.name, taskName),
          or(
            isNull(schedulerTask.lockedAt),
            lt(schedulerTask.lockedAt, staleTime)
          )
        )
      )
      .returning({ name: schedulerTask.name })

    if (updatedRows.length === 0) {
      logger.warn({ taskName }, `Task skipped: previous run is still active (database lock)`)
      return {
        success: false,
        durationMs: 0,
        error: 'Concurrency lock active'
      }
    }

    lockAcquired = true
    logger.info({ taskName }, `Task started: ${taskName}`)

    const data = await taskFn()
    const durationMs = Date.now() - start

    // Release lock and record success
    await db
      .update(schedulerTask)
      .set({
        lockedAt: null,
        lastRunAt: new Date(),
        lastDurationMs: durationMs,
        lastStatus: 'success',
        lastError: null
      })
      .where(eq(schedulerTask.name, taskName))

    logger.info({ taskName, durationMs, data }, `Task completed successfully: ${taskName} in ${durationMs}ms`)
    return {
      success: true,
      durationMs,
      data
    }
  } catch (error) {
    const durationMs = Date.now() - start
    const errMessage = error instanceof Error ? error.message : String(error)
    logger.error(
      { taskName, durationMs, error },
      `Task failed: ${taskName} in ${durationMs}ms. Error: ${errMessage}`
    )

    if (lockAcquired) {
      // Release lock and record failure
      try {
        await db
          .update(schedulerTask)
          .set({
            lockedAt: null,
            lastRunAt: new Date(),
            lastDurationMs: durationMs,
            lastStatus: 'failed',
            lastError: errMessage
          })
          .where(eq(schedulerTask.name, taskName))
      } catch (dbErr) {
        logger.error({ taskName, dbErr }, 'Failed to release task lock on error')
      }
    }

    return {
      success: false,
      durationMs,
      error: errMessage
    }
  }
}
export const activeLocks = new Set<string>() // Export empty lock set if anything expects it, but database-backed lock is primary.
