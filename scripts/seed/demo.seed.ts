import { deleteCredentialUser, upsertCredentialUser } from './auth.seed'
import { buildAdminUser, buildDemoUser } from './factories/user.factory'
import type { SeedClient, SeedConfig, SeedSummary } from './types'

export const seedDemo = async (client: SeedClient, config: SeedConfig): Promise<SeedSummary> => {
  const demoUser = buildDemoUser(config)
  const user = await upsertCredentialUser(client, demoUser)

  const adminUser = buildAdminUser(config)
  const admin = await upsertCredentialUser(client, adminUser)

  return {
    name: 'demo',
    records: [
      {
        type: 'user',
        email: user.email,
        password: user.password
      },
      {
        type: 'user',
        email: admin.email,
        password: admin.password
      }
    ]
  }
}

export const resetDemo = async (client: SeedClient, config: SeedConfig): Promise<SeedSummary> => {
  const demoUser = buildDemoUser(config)
  await deleteCredentialUser(client, demoUser)

  const adminUser = buildAdminUser(config)
  await deleteCredentialUser(client, adminUser)

  return {
    name: 'demo:reset',
    records: [
      {
        type: 'user',
        email: demoUser.email
      },
      {
        type: 'user',
        email: adminUser.email
      }
    ]
  }
}
