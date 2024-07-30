import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const checkInsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseCase(checkInsRepository)

  return useCase
}
