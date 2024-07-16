import { PrismaUsersRepositories } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const userRepository = new PrismaUsersRepositories()
  const registerUseCase = new RegisterUseCase(userRepository)

  return registerUseCase
}
