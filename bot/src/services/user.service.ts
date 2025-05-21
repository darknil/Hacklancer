import { ExternalUserService } from '../external/ExternalUserService'
import { UserRepository } from '../repositories/UserRepository'
import { UserData } from '../types/UserData'

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private externalUserService: ExternalUserService
  ) {}

  async findOrCreate(userData: UserData): Promise<UserData> {
    const cachedUser = await this.userRepository.get(String(userData.chatId))
    if (cachedUser) {
      return cachedUser
    }

    const externalUser = await this.externalUserService.fetchUserProfile(
      userData.chatId
    )

    if (externalUser) {
      await this.userRepository.save(String(userData.chatId), externalUser)
      return externalUser
    }

    const newUser = await this.externalUserService.createUser(userData)
    if (newUser) {
      await this.userRepository.save(String(userData.chatId), newUser)
      return newUser
    }

    throw new Error(`Failed to create user ${userData}`)
  }
}
