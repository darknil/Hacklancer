import { ExternalRecommendationService } from '../external/ExternalRecommendationService'
import { ExternalUserService } from '../external/ExternalUserService'
import { UserProfileRepository } from '../repositories/UserProfileRepository'
import { UserRepository } from '../repositories/UserRepository'
import { ProfileData } from '../types/ProfileData'
import { UserData } from '../types/UserData'
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
    console.log(`[${new Date().toISOString()}] fetching recommendations :`, ids)
    if (!ids.length) return

    const users = await Promise.all(
      ids.map((id) => this.externalUserService.fetchUserProfile(id))
    )

    const userDataArray: UserData[] = users.filter((u): u is UserData => !!u)

    console.log(
      `[${new Date().toISOString()}] initializing session for user :${chatId}`
    )
    await this.userRepository.update(chatId, {
      recommendationArray: ids
    })

    await Promise.all(
      userDataArray.map(async (user) => {
        const existedProfile = await this.userProfileRepository.get(user.chatId)
        // if (existedProfile) return
        try {
          const role = await this.roleService.findRole(user.roleId ?? '')
          console.log(
            `[${new Date().toISOString()}] user role id:`,
            user.roleId
          )
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
