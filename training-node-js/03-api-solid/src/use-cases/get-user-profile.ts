import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserPorfileUseCaseRequest {
  userId: string
}

interface GetUserPorfileUseCaseResponse {
  user: User
}

export class GetUserPorfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserPorfileUseCaseRequest): Promise<GetUserPorfileUseCaseResponse> {
    const user = await this.usersRepository.findByid(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
