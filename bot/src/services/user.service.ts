import { ExternalUserService } from '../external/ExternalUserService'
import { UserRepository } from '../repositories/UserRepository'
import { UserData } from '../types/UserData'

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private externalUserService: ExternalUserService
  ) {}

  async findOrCreate(userData: UserData): Promise<UserData> {
    try {
      const cachedUser = await this.userRepository.get(String(userData.chatId))
      if (cachedUser) return cachedUser
      console.log('user chatId :', userData.chatId)
      const externalUser = await this.externalUserService.fetchUserProfile(
        userData.chatId
      )
      console.log('externalUser :', externalUser)
      if (externalUser) {
        await this.userRepository.save(String(userData.chatId), externalUser)
        return externalUser
      }

      const newUser = await this.externalUserService.createUser(userData)
      console.log('newUser :', newUser)
      if (newUser) {
        await this.userRepository.save(String(userData.chatId), newUser)
        return newUser
      }

      throw new Error(`User creation failed: ${JSON.stringify(userData)}`)
    } catch (err) {
      console.error('❌ Error in findOrCreate:', err)
      throw new Error(
        `Failed to create user: ${
          err instanceof Error ? err.message : String(err)
        }`
      )
    }
  }
  async find(chatId: number): Promise<UserData | null> {
    const cashedData = await this.userRepository.get(chatId)
    if (cashedData) return cashedData
    const externalUser = await this.externalUserService.fetchUserProfile(chatId)
    if (externalUser) {
      await this.userRepository.save(chatId, externalUser)
      return externalUser
    }
    return null
  }
  async saveUser(user: UserData) {
    await this.externalUserService.updateUser(user)
  }
  async getLastViewedId(userId: number): Promise<number | undefined> {
    const userData = await this.userRepository.get(userId)
    return userData?.lastViewedId
  }
}
