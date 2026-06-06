import { pool } from '~~/server/database/client'
import { env } from '~~/server/utils/env'
import { assertRateLimit } from '~~/server/utils/rate-limit'

type DatabaseStatus = {
  status: 'ok'
  version: string
  max_connections: number
  opened_connections: number
}

const firstRow = <T>(rows: T[]): T => {
  const row = rows[0]

  if (!row) {
    throw new Error('Query did not return any rows')
  }

  return row
}

export default defineEventHandler(async (event) => {
  assertRateLimit(event, {
    keyPrefix: 'status'
  })

  const updatedAt = new Date().toISOString()

  try {
    const [
      databaseVersionQuery,
      maxConnectionsQuery,
      databaseNameQuery
    ] = await Promise.all([
      pool.query<{ server_version: string }>('SHOW server_version;'),
      pool.query<{ max_connections: string }>('SHOW max_connections;'),
      pool.query<{ current_database: string }>('SELECT current_database();')
    ])

    const databaseName = firstRow(databaseNameQuery.rows).current_database
    const openedConnectionsQuery = await pool.query<{ count: number }>({
      text: 'SELECT count(*)::int as count FROM pg_stat_activity WHERE datname = $1;',
      values: [databaseName]
    })

    const database: DatabaseStatus | { status: 'ok' } = env.STATUS_EXPOSE_DETAILS
      ? {
      status: 'ok',
      version: firstRow(databaseVersionQuery.rows).server_version,
      max_connections: Number.parseInt(firstRow(maxConnectionsQuery.rows).max_connections, 10),
      opened_connections: firstRow(openedConnectionsQuery.rows).count
        }
      : {
          status: 'ok'
        }

    return {
      updated_at: updatedAt,
      status: 'ok',
      dependencies: {
        database
      }
    }
  } catch {
    throw createError({
      statusCode: 503,
      message: 'Banco de dados indisponível',
      data: {
        updated_at: updatedAt,
        status: 'error',
        dependencies: {
          database: {
            status: 'error'
          }
        }
      }
    })
  }
})
