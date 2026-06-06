import type { SeedConfig, SeedUser } from '../types'

export const buildDemoUser = (config: SeedConfig): SeedUser => ({
  id: config.demoUser.id,
  accountId: config.demoUser.accountId,
  email: config.demoUser.email,
  name: config.demoUser.name,
  password: config.demoUser.password
})
