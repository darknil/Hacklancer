import { UserStateHandlers } from '../types/UserStateHandlers'
import { AwaitingNameState } from './state/registration/awaitingName'
import { STATES } from '../constants/states'
import { AwaitingCityState } from './state/registration/AwaitingCity'
import { AwaitingDescriptionState } from './state/registration/AwaitingDescription'
import { AwaitingRolesState } from './state/registration/AwaitingRoles'
import { AwaitingPhotoState } from './state/registration/AwaitingPhoto'
import { AwaitingAprovalState } from './state/registration/AwaitingAproval'
import { MainAwaitingActionState } from './state/main/AwaitingAction'
import { ViewProfileState } from './state/matching/ViewProfile'
import { UserRepository } from '../repositories/UserRepository'
import { ExternalUserService } from '../external/ExternalUserService'
import { UserService } from '../services/user.service'
import { ExternalRecommendationService } from '../external/ExternalRecommendationService'
import { UserProfileRepository } from '../repositories/UserProfileRepository'
import { RoleRepository } from '../repositories/RoleRepository'
import { RecommendationService } from '../services/recommendation.service'
import { RoleService } from '../services/role.service'
import { ExternalRoleService } from '../external/ExternalRoleService'
import { ProfileAwaitingActionState } from './state/profile/AwaitingAction'

export class StateHandlerFactory {
  private userRepository: UserRepository
  private externalUserService: ExternalUserService
  private externalRoleService: ExternalRoleService
  private userService: UserService
  private externalRecommendationService: ExternalRecommendationService
  private userProfileRepository: UserProfileRepository
  private roleRepository: RoleRepository
  private recommendationService: RecommendationService
  private roleService: RoleService

  constructor() {
    this.userRepository = new UserRepository()
    this.externalUserService = new ExternalUserService()
    this.externalRoleService = new ExternalRoleService()
    this.userService = new UserService(
      this.userRepository,
      this.externalUserService
    )
    this.roleRepository = new RoleRepository()
    this.roleService = new RoleService(
      this.roleRepository,
      this.externalRoleService
    )
    this.externalRecommendationService = new ExternalRecommendationService()
    this.userProfileRepository = new UserProfileRepository()

    this.recommendationService = new RecommendationService(
      this.externalRecommendationService,
      this.externalUserService,
      this.userProfileRepository,
      this.roleService,
      this.userRepository
    )
  }
  createStateHandlers = (): UserStateHandlers => ({
    // =================== REGISTRATION ===================
    [STATES.REGISTRATION.AWAITING_NAME]: new AwaitingNameState(
      this.userRepository
    ),
    [STATES.REGISTRATION.AWAITING_CITY]: new AwaitingCityState(
      this.userRepository,
      this.roleService
    ),
    [STATES.REGISTRATION.AWAITING_ROLES]: new AwaitingRolesState(
      this.userRepository,
      this.roleService
    ),
    [STATES.REGISTRATION.AWAITING_DESCRIPTION]: new AwaitingDescriptionState(
      this.userRepository
    ),
    [STATES.REGISTRATION.AWAITING_PHOTO]: new AwaitingPhotoState(
      this.userRepository,
      this.roleService
    ),
    [STATES.REGISTRATION.AWAITING_APPROVAL]: new AwaitingAprovalState(
      this.userRepository,
      this.userService
    ),

    // =================== REGISTRATION ===================

    // =================== MAIN ===================
    [STATES.MAIN.AWAITING_ACTION]: new MainAwaitingActionState(
      this.userRepository,
      this.recommendationService,
      this.userService,
      this.roleService
    ),
    // =================== MAIN ===================

    // =================== MATCHING ===================
    [STATES.MATCHING.VIEW_PROFILE]: new ViewProfileState(
      this.userService,
      this.userProfileRepository,
      this.recommendationService,
      this.userRepository
    ),
    // =================== MATCHING ===================

    // =================== PROFILE ===================
    [STATES.PROFILE.AWAITING_ACTION]: new ProfileAwaitingActionState(
      this.userRepository,
      this.roleService,
      this.userService
    )
    // =================== PROFILE ===================
  })
}
