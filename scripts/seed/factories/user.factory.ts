import type { SeedConfig, SeedUser } from '../types'

export const buildDemoUser = (config: SeedConfig): SeedUser => ({
  id: config.demoUser.id,
  accountId: config.demoUser.accountId,
  email: config.demoUser.email,
  name: config.demoUser.name,
  password: config.demoUser.password,
  role: config.demoUser.role
})

export const buildAdminUser = (config: SeedConfig): SeedUser => ({
  id: config.adminUser.id,
  accountId: config.adminUser.accountId,
  email: config.adminUser.email,
  name: config.adminUser.name,
  password: config.adminUser.password,
  role: config.adminUser.role
})
