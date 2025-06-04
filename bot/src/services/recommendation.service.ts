import { ExternalRecommendationService } from '../external/ExternalRecommendationService'
import { ExternalUserService } from '../external/ExternalUserService'
import { RoleRepository } from '../repositories/RoleRepository'
import { UserProfileRepository } from '../repositories/UserProfileRepository'
import { UserRepository } from '../repositories/UserRepository'
import { ProfileData } from '../types/ProfileData'
import { UserData } from '../types/UserData'

export class RecommendationService {
  constructor(
    private externalRecommendationService: ExternalRecommendationService,
    private externalUserService: ExternalUserService,
    private userProfileRepository: UserProfileRepository,
    private roleRepository: RoleRepository,
    private userRepository: UserRepository
  ) {}
  async initializeUserSession(chatId: number): Promise<void> {
    const ids = await this.externalRecommendationService.fetchRecommendations(
      chatId
    )
    if (!ids.length) return

    const users = await Promise.all(
      ids.map((id) => this.externalUserService.fetchUserProfile(id))
    )

    const userDataArray: UserData[] = users.filter((u): u is UserData => !!u)

    console.log(
      `[${new Date().toISOString()}] initializing user session for ${chatId}`
    )
    await this.userRepository.update(chatId, {
      recommendationArray: ids
    })

    userDataArray.forEach(async (user) => {
      try {
        const role = await this.roleRepository.get(user.roleId ?? '')
        const profileData: ProfileData = {
          nickname: user.nickname ?? '',
          city: user.city ?? '',
          description: user.description ?? '',
          photoURL: user.photoURL ?? '',
          rolename: role?.name ?? ''
        }
        await this.userProfileRepository.save(user.chatId, profileData)
      } catch (err) {
        console.error(`Failed to save profile for user ${user.chatId}:`, err)
      }
    })
  }

  async getNextProfile(chatId: number): Promise<ProfileData | null> {
    let user = await this.userRepository.get(chatId)
    let recommendationArray = user?.recommendationArray ?? []

    if (!recommendationArray.length) {
      await this.initializeUserSession(chatId)
      user = await this.userRepository.get(chatId)
      recommendationArray = user?.recommendationArray ?? []

      if (!recommendationArray.length) {
        return null
      }
    }

    const [nextId, ...rest] = recommendationArray

    await this.userRepository.update(chatId, {
      lastViewedId: nextId,
      recommendationArray: rest
    })

    return this.userProfileRepository.get(nextId)
  }
}
