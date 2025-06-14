import { UserStateHandlers } from '../types/user-state-handlers.type'
import { AwaitingNameState } from './state/registration/awaiting-name'
import { STATES } from '../constants/states'
import { AwaitingCityState } from './state/registration/awaiting-city'
import { AwaitingDescriptionState } from './state/registration/awaiting-description'
import { AwaitingRolesState } from './state/registration/awaiting-roles'
import { AwaitingPhotoState } from './state/registration/awaiting-photo'
import { AwaitingAprovalState } from './state/registration/awaiting-aproval'
import { MainAwaitingActionState } from './state/main/awaiting-action'
import { ViewProfileState } from './state/matching/view-profile'
import { UserRepository } from '../repositories/user.repository'
import { ExternalUserService } from '../external/external-user.service'
import { UserService } from '../services/user.service'
import { ExternalRecommendationService } from '../external/external-recommendation.service'
import { UserProfileRepository } from '../repositories/user-profile.repository'
import { RoleRepository } from '../repositories/role.repository'
import { RecommendationService } from '../services/recommendation.service'
import { RoleService } from '../services/role.service'
import { ExternalRoleService } from '../external/external-role.service'
import { ProfileAwaitingActionState } from './state/profile/awaiting-action'
import { ProfileAwaitingDescriptionState } from './state/profile/awaiting-desc'
import { ProfileAwaitingPhotoState } from './state/profile/awaiting-photo'
import { UserProfileService } from '../services/user-profile.service'

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
  private userProfileService: UserProfileService

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
    this.userProfileService = new UserProfileService(
      this.userProfileRepository,
      this.userService,
      this.roleService
    )
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
      this.roleService,
      this.userService
    ),
    [STATES.REGISTRATION.AWAITING_ROLES]: new AwaitingRolesState(
      this.userRepository,
      this.roleService,
      this.userService
    ),
    [STATES.REGISTRATION.AWAITING_DESCRIPTION]: new AwaitingDescriptionState(
      this.userRepository,
      this.userService
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
      this.userRepository,
      this.userProfileService
    ),
    // =================== MATCHING ===================

    // =================== PROFILE ===================
    [STATES.PROFILE.AWAITING_ACTION]: new ProfileAwaitingActionState(
      this.userRepository,
      this.roleService,
      this.userService
    ),
    [STATES.PROFILE.EDIT_DESCRIPTION]: new ProfileAwaitingDescriptionState(
      this.userService,
      this.roleService,
      this.userRepository
    ),
    [STATES.PROFILE.EDIT_PHOTO]: new ProfileAwaitingPhotoState(
      this.userRepository,
      this.roleService,
      this.userService
    )
    // =================== PROFILE ===================
  })
}
