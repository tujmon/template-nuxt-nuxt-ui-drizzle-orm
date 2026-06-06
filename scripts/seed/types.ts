import type { Pool, PoolClient } from 'pg'

export type SeedMode = 'all' | 'system' | 'demo'

export type SeedOptions = {
  only: SeedMode
  reset: boolean
}

export type SeedUser = {
  id: string
  accountId: string
  email: string
  name: string
  password: string
}

export type SeedConfig = {
  databaseUrl: string
  demoUser: SeedUser
}

export type SeedRecord = {
  type: string
  email?: string
  password?: string
}

export type SeedSummary = {
  name: string
  records: SeedRecord[]
}

export type SeedPool = Pool
export type SeedClient = PoolClient
