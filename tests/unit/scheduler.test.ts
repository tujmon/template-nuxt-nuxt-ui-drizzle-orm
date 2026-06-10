import { eq } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { db, pool } from '../../server/database/client'
import { schedulerTask } from '../../server/database/schema/scheduler'
import { runTaskWithGuardrails } from '../../server/utils/scheduler'

describe('Scheduler Utility Test', () => {
  beforeAll(async () => {
    // Apply migrations before running tests
    await migrate(db, { migrationsFolder: './server/database/migrations' })
  })

  beforeEach(async () => {
    // Clean up scheduler_task table before each test
    await db.delete(schedulerTask)
  })

  afterAll(async () => {
    // Close the DB connection pool
    await pool.end()
  })

  // Helper to fetch task row from database
  const getTaskRow = async (taskName: string) => {
    const dbRows = await db
      .select()
      .from(schedulerTask)
      .where(eq(schedulerTask.name, taskName))
      .limit(1)
    return dbRows[0]
  }

  it('should acquire and release lock on successful run', async () => {
    const taskName = 'test:success-lock'
    const taskFn = vi.fn().mockResolvedValue('task_result')

    const result = await runTaskWithGuardrails(taskName, taskFn)

    // Verify task function was called
    expect(taskFn).toHaveBeenCalledOnce()
    expect(result.success).toBe(true)
    expect(result.data).toBe('task_result')
    expect(result.durationMs).toBeGreaterThanOrEqual(0)

    // Verify database state has released the lock
    const row = await getTaskRow(taskName)
    expect(row).toBeDefined()
    expect(row?.lockedAt).toBeNull()
    expect(row?.lastStatus).toBe('success')
    expect(row?.lastError).toBeNull()
    expect(row?.lastDurationMs).toBe(result.durationMs)
  })

  it('should acquire and release lock on failed run', async () => {
    const taskName = 'test:failure-lock'
    const taskFn = vi.fn().mockRejectedValue(new Error('task_error'))

    const result = await runTaskWithGuardrails(taskName, taskFn)

    // Verify task function was called
    expect(taskFn).toHaveBeenCalledOnce()
    expect(result.success).toBe(false)
    expect(result.error).toBe('task_error')

    // Verify database state has released the lock but registered the error
    const row = await getTaskRow(taskName)
    expect(row).toBeDefined()
    expect(row?.lockedAt).toBeNull()
    expect(row?.lastStatus).toBe('failed')
    expect(row?.lastError).toBe('task_error')
  })

  it('should block concurrent executions of the same task', async () => {
    const taskName = 'test:concurrent-lock'

    // We simulate a task running that takes a moment
    const taskFn1 = async () => {
      // While this runs, we try to run it again
      const result2 = await runTaskWithGuardrails(taskName, async () => 'inner')
      expect(result2.success).toBe(false)
      expect(result2.error).toBe('Concurrency lock active')
      return 'outer'
    }

    const result1 = await runTaskWithGuardrails(taskName, taskFn1)
    expect(result1.success).toBe(true)
    expect(result1.data).toBe('outer')
  })

  it('should expire and recover stale locks', async () => {
    const taskName = 'test:stale-lock'

    // Manually insert a stale lock in the database (older than 15 minutes)
    const staleDate = new Date(Date.now() - 20 * 60 * 1000)
    await db.insert(schedulerTask).values({
      name: taskName,
      lockedAt: staleDate
    })

    const taskFn = vi.fn().mockResolvedValue('stale_recovered')

    const result = await runTaskWithGuardrails(taskName, taskFn, {
      staleTimeoutMs: 15 * 60 * 1000 // 15 minutes stale threshold
    })

    expect(taskFn).toHaveBeenCalledOnce()
    expect(result.success).toBe(true)
    expect(result.data).toBe('stale_recovered')
  })

  it('should restrict execution based on environment config', async () => {
    const taskName = 'test:env-lock'
    const taskFn = vi.fn().mockResolvedValue('should_not_run')

    const result = await runTaskWithGuardrails(taskName, taskFn, {
      allowedEnvironments: ['production'] // We are in 'test' mode, so it should be blocked
    })

    expect(taskFn).not.toHaveBeenCalled()
    expect(result.success).toBe(false)
    expect(result.error).toContain("Environment 'test' not allowed")
  })
})
