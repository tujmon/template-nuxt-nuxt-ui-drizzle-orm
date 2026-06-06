import { upsertCredentialUser, deleteCredentialUser } from './auth.seed'
import { buildDemoUser } from './factories/user.factory'
import type { SeedClient, SeedConfig, SeedSummary } from './types'

export const seedDemo = async (client: SeedClient, config: SeedConfig): Promise<SeedSummary> => {
  const demoUser = buildDemoUser(config)
  const user = await upsertCredentialUser(client, demoUser)

  return {
    name: 'demo',
    records: [
      {
        type: 'user',
        email: user.email,
        password: user.password
      }
    ]
  }
}

export const resetDemo = async (client: SeedClient, config: SeedConfig): Promise<SeedSummary> => {
  const demoUser = buildDemoUser(config)
  await deleteCredentialUser(client, demoUser)

  return {
    name: 'demo:reset',
    records: [
      {
        type: 'user',
        email: demoUser.email
      }
    ]
  }
}
