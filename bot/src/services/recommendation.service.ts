import { ExternalRecommendationService } from '../external/external-recommendation.service'
import { ExternalUserService } from '../external/external-user.service'
import { UserProfileRepository } from '../repositories/user-profile.repository'
import { UserRepository } from '../repositories/user.repository'
import { ProfileData } from '../types/profile-data.type'
import { UserData } from '../types/user-data.type'
import { RoleService } from './role.service'

export class RecommendationService {
  constructor(
    private externalRecommendationService: ExternalRecommendationService,
    private externalUserService: ExternalUserService,
    private userProfileRepository: UserProfileRepository,
    private roleService: RoleService,
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

    await this.userRepository.update(chatId, {
      recommendationArray: ids
    })

    await Promise.all(
      userDataArray.map(async (user) => {
        const existedProfile = await this.userProfileRepository.get(user.chatId)
        if (existedProfile) return
        try {
          const role = await this.roleService.findRole(user.roleId ?? '')

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
    )
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
