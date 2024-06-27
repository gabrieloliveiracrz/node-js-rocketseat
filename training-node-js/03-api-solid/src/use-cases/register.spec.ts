import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let userRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(userRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'test',
      email: 'test@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'test',
      email: 'test@example.com',
      password: '123456',
    })

    const isPasswordCorretlyHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorretlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'test@example.com'

    await sut.execute({
      name: 'test',
      email,
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        name: 'test',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
