import { PrismaUsersRepositories } from '@/repositories/prisma/prisma-users-repository'
import { GetUserPorfileUseCase } from '../get-user-profile'

export function makeGetUserProfileUseCase() {
  const userRepository = new PrismaUsersRepositories()
  const useCase = new GetUserPorfileUseCase(userRepository)

  return useCase
}
