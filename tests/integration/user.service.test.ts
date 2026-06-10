import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { db, pool } from '../../server/database/client'
import { account, session, user, verification } from '../../server/database/schema/auth'
import { UserService } from '../../server/services/user'

describe('UserService Integration Test', () => {
  let userService: UserService

  beforeAll(async () => {
    await migrate(db, { migrationsFolder: './server/database/migrations' })
  })

  beforeEach(async () => {
    userService = new UserService()
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

  describe('UserService Unit Test with Mock Repository', () => {
    it('should query the mocked repository', async () => {
      const mockUser = {
        id: 'usr_mock',
        name: 'Mock User',
        email: 'mock@domain.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const mockUserRepository = {
        findById: vi.fn().mockResolvedValue(mockUser),
        update: vi.fn().mockResolvedValue({ ...mockUser, name: 'Mock Updated' })
      }

      const mockUserService = new UserService(mockUserRepository)
      const result = await mockUserService.findById('usr_mock')

      expect(mockUserRepository.findById).toHaveBeenCalledWith('usr_mock')
      expect(result).toEqual(mockUser)
    })

    it('should reject domain validations without invoking persistence', async () => {
      const mockUserRepository = {
        findById: vi.fn(),
        update: vi.fn()
      }

      const mockUserService = new UserService(mockUserRepository)

      // Test validation of invalid email
      await expect(
        mockUserService.updateProfile('usr_mock', { email: 'invalid-email' })
      ).rejects.toThrow('E-mail inválido de acordo com as regras de domínio')

      expect(mockUserRepository.update).not.toHaveBeenCalled()
    })
  })
})
