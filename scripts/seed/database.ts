import * as pg from 'pg'
import type { SeedClient, SeedPool } from './types'

const { Pool } = pg

export const createSeedPool = (databaseUrl: string): SeedPool => {
  return new Pool({
    connectionString: databaseUrl
  })
}

export const runInTransaction = async <Result>(
  pool: SeedPool,
  callback: (client: SeedClient) => Promise<Result>
): Promise<Result> => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
