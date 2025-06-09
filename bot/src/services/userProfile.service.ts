import { UserProfileRepository } from '../repositories/UserProfileRepository'
import { ProfileData } from '../types/ProfileData'
import { RoleService } from './role.service'
import { UserService } from './user.service'

export class UserProfileService {
  constructor(
    private userProfileRepository: UserProfileRepository,
    private userService: UserService,
    private roleService: RoleService
  ) {}
  async find(userId: number) {
    const cashedUserProfile = await this.userProfileRepository.get(userId)
    if (cashedUserProfile) return cashedUserProfile
    const externalUserProfile = await this.userService.find(userId)
    if (!externalUserProfile || !externalUserProfile.roleId) return
    const rolename = await this.roleService.findRole(externalUserProfile.roleId)
    const userProfile: ProfileData = {
      nickname: externalUserProfile?.nickname ?? '',
      city: externalUserProfile?.city ?? '',
      description: externalUserProfile?.description ?? '',
      photoURL: externalUserProfile?.photoURL ?? '',
      rolename: rolename?.name ?? ''
    }
    this.userProfileRepository.save(userId, userProfile)
    return userProfile
  }
}
