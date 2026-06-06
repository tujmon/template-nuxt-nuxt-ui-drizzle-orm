import { drizzle } from 'drizzle-orm/node-postgres'
import * as pg from 'pg'
import * as schema from './schema'
import { env } from '../utils/env'

const { Pool } = pg

export const pool = new Pool({
  connectionString: env.DATABASE_URL
})

export const db = drizzle(pool, { schema })
