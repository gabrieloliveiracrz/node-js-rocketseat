import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export function makeCreateGymUseCase() {
  const checkInsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(checkInsRepository)

  return useCase
}
