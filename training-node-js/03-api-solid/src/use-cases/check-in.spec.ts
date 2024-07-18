import { InMemoryCheckInsRepository } from './../repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CheckInUseCase } from './check-in'

let userRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use case', () => {
  beforeEach(() => {
    userRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(userRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})