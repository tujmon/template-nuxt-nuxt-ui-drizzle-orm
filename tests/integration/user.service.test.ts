/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService } from '../../server/services/user'
import { db } from '../../server/database/client'

describe('UserService Integration Test', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
  })

  it('should retrieve a user by ID', async () => {
    const mockUser = {
      id: 'usr_123',
      name: 'João Teste',
      email: 'joao@teste.com',
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const selectSpy = vi.spyOn(db, 'select').mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([mockUser])
        })
      })
    } as any)

    const result = await userService.findById('usr_123')

    expect(db.select).toHaveBeenCalled()
    expect(result).toBeDefined()
    expect(result?.name).toBe('João Teste')
    expect(result?.email).toBe('joao@teste.com')

    selectSpy.mockRestore()
  })

  it('should update user profile successfully', async () => {
    const updateSpy = vi.spyOn(db, 'update').mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({ rowCount: 1 })
      })
    } as any)

    const selectSpy = vi.spyOn(userService, 'findById').mockResolvedValue({
      id: 'usr_123',
      name: 'João Atualizado',
      email: 'joao@novo.com',
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const result = await userService.updateProfile('usr_123', {
      name: 'João Atualizado',
      email: 'joao@novo.com'
    })

    expect(db.update).toHaveBeenCalled()
    expect(userService.findById).toHaveBeenCalledWith('usr_123')
    expect(result?.name).toBe('João Atualizado')

    updateSpy.mockRestore()
    selectSpy.mockRestore()
  })
})
