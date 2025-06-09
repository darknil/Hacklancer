import { ExternalUserService } from '../external/ExternalUserService'
import { UserRepository } from '../repositories/UserRepository'
import { UserData } from '../types/UserData'

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private externalUserService: ExternalUserService
  ) {}

  async findOrCreate(userData: UserData): Promise<UserData> {
    const chatId = String(userData.chatId)
    const cachedUser = await this.userRepository.get(chatId)

    if (cachedUser) {
      const updatedUser = this.mergeUserDataIfChanged(cachedUser, userData)

      if (updatedUser) {
        await this.userRepository.save(chatId, updatedUser)
        return updatedUser
      }

      return cachedUser
    }

    const externalUser = await this.externalUserService.fetchUserProfile(
      userData.chatId
    )
    if (externalUser) {
      const mergedUser = this.mergeUserDataIfChanged(externalUser, userData)

      if (mergedUser) {
        await this.userRepository.save(chatId, mergedUser)
        return mergedUser
      }

      await this.userRepository.save(chatId, externalUser)
      return externalUser
    }

    const newUser = await this.externalUserService.createUser(userData)
    if (newUser) {
      await this.userRepository.save(chatId, newUser)
      return newUser
    }

    throw new Error(`User creation failed: ${JSON.stringify(userData)}`)
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
    const userData = await this.find(userId)
    if (!userData) return undefined
    return userData?.lastViewedId ?? undefined
  }
  private mergeUserDataIfChanged(
    existing: UserData,
    current: UserData
  ): UserData | null {
    const fieldsToCheck: (keyof UserData)[] = [
      'username',
      'first_name',
      'last_name',
      'language_code'
    ]

    const hasChanges = fieldsToCheck.some((field) => {
      return current[field] !== undefined && current[field] !== existing[field]
    })

    if (!hasChanges) return null

    return {
      ...existing,
      ...this.removeUndefinedFields(current)
    }
  }
  private removeUndefinedFields<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined)
    ) as Partial<T>
  }
}
