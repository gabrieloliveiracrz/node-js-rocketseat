import { PrismaUsersRepositories } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const userRepository = new PrismaUsersRepositories()
  const authenticate = new AuthenticateUseCase(userRepository)

  return authenticate
}
