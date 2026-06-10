import { lt } from 'drizzle-orm'
import { db } from '../database/client'
import { session } from '../database/schema/auth'
import { runTaskWithGuardrails } from '../utils/scheduler'

export default defineTask({
  meta: {
    name: 'cleanup-sessions',
    description: 'Removes expired sessions from the PostgreSQL database'
  },
  async run() {
    const result = await runTaskWithGuardrails('cleanup-sessions', async () => {
      // Delete sessions where expiresAt < now
      const deleteResult = await db
        .delete(session)
        .where(lt(session.expiresAt, new Date()))
        .returning({ id: session.id })

      return {
        deletedCount: deleteResult.length
      }
    })

    return {
      result: {
        success: result.success,
        deletedCount: result.data?.deletedCount ?? 0,
        durationMs: result.durationMs,
        error: result.error
      }
    }
  }
})
