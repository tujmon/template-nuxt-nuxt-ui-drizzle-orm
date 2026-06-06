import { parseSeedArgs, printSeedSummary } from './cli'
import { createSeedPool, runInTransaction } from './database'
import { getSeedConfig, loadSeedEnv } from './env'
import { resetDemo, seedDemo } from './demo.seed'
import { seedSystem } from './system.seed'
import type { SeedClient, SeedConfig, SeedOptions, SeedSummary } from './types'

const runSeeds = async (
  client: SeedClient,
  config: SeedConfig,
  options: SeedOptions
): Promise<SeedSummary[]> => {
  const summaries: SeedSummary[] = []

  if (options.reset) {
    summaries.push(await resetDemo(client, config))
  }

  if (options.only === 'all' || options.only === 'system') {
    summaries.push(await seedSystem(client, config))
  }

  if (options.only === 'all' || options.only === 'demo') {
    summaries.push(await seedDemo(client, config))
  }

  return summaries
}

loadSeedEnv()

const options = parseSeedArgs(process.argv.slice(2))
const config = getSeedConfig()
const pool = createSeedPool(config.databaseUrl)

try {
  const summaries = await runInTransaction(pool, client => runSeeds(client, config, options))
  printSeedSummary(summaries)
} finally {
  await pool.end()
}
