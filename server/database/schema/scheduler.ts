import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const schedulerTask = pgTable('scheduler_task', {
  name: text('name').primaryKey(),
  lockedAt: timestamp('locked_at'),
  lastRunAt: timestamp('last_run_at'),
  lastDurationMs: integer('last_duration_ms'),
  lastStatus: text('last_status'), // 'success' | 'failed'
  lastError: text('last_error')
})
