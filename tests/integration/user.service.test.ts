import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { UserService } from '../../server/services/user'
import { db, pool } from '../../server/database/client'
import { account, session, user, verification } from '../../server/database/schema/auth'

describe('UserService Integration Test', () => {
  let userService: UserService

  beforeAll(async () => {
    await migrate(db, { migrationsFolder: './server/database/migrations' })
  })

  beforeEach(() => {
    userService = new UserService()
  })

  beforeEach(async () => {
    await db.delete(account)
    await db.delete(session)
    await db.delete(verification)
    await db.delete(user)
  })

  afterAll(async () => {
    await pool.end()
  })

  it('should retrieve a user by ID from PostgreSQL', async () => {
    await db.insert(user).values({
      id: 'usr_123',
      name: 'João Teste',
      email: 'joao@teste.com',
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await userService.findById('usr_123')

    expect(result).toBeDefined()
    expect(result?.name).toBe('João Teste')
    expect(result?.email).toBe('joao@teste.com')
  })

  it('should update user profile in PostgreSQL', async () => {
    await db.insert(user).values({
      id: 'usr_123',
      name: 'João Teste',
      email: 'joao@teste.com',
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await userService.updateProfile('usr_123', {
      name: 'João Atualizado',
      email: 'joao@novo.com'
    })

    expect(result?.name).toBe('João Atualizado')
    expect(result?.email).toBe('joao@novo.com')
  })

  it('should reject profile updates without valid fields', async () => {
    await expect(userService.updateProfile('usr_123', {})).rejects.toThrow(
      'Informe pelo menos um campo para atualizar'
    )
  })
})
