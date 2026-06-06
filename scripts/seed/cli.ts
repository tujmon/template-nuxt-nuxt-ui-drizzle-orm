/* eslint-disable no-console */
import type { SeedMode, SeedOptions, SeedSummary } from './types'

const seedModes: SeedMode[] = ['all', 'system', 'demo']

const isSeedMode = (value: string): value is SeedMode => {
  return seedModes.includes(value as SeedMode)
}

export const parseSeedArgs = (argv: string[]): SeedOptions => {
  const options: SeedOptions = {
    only: 'all',
    reset: false
  }

  for (const arg of argv) {
    if (arg === '--reset') {
      options.reset = true
      continue
    }

    if (arg.startsWith('--only=')) {
      const mode = arg.split('=')[1] || ''

      if (!isSeedMode(mode)) {
        throw new Error(`Invalid seed mode "${mode}". Use all, system or demo.`)
      }

      options.only = mode
    }
  }

  return options
}

export const printSeedSummary = (summaries: SeedSummary[]) => {
  for (const summary of summaries) {
    if (!summary.records.length) {
      console.log(`Seed ${summary.name}: no records`)
      continue
    }

    for (const record of summary.records) {
      const credentials = record.password ? ` / ${record.password}` : ''
      console.log(`Seed ${summary.name}: ${record.type} ${record.email}${credentials}`)
    }
  }
}
