import type { SeedClient, SeedConfig, SeedSummary } from './types'

export const seedSystem = async (
  _client: SeedClient,
  _config: SeedConfig
): Promise<SeedSummary> => {
  return {
    name: 'system',
    records: []
  }
}
