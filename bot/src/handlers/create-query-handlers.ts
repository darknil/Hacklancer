import { QUERIES } from '../constants/queries'
import { BotQueryHandlers } from '../types/bot-query-handlers.type'
import { Response } from './callBackQuery/Response'
import { Ignore } from './callBackQuery/Ignore'
import { UserRepository } from '../repositories/user.repository'
import { ExternalUserService } from '../external/external-user.service'
import { ExternalRoleService } from '../external/external-role.service'
import { UserService } from '../services/user.service'
import { ExternalRecommendationService } from '../external/external-recommendation.service'
import { UserProfileRepository } from '../repositories/user-profile.repository'
import { RoleRepository } from '../repositories/role.repository'
import { RecommendationService } from '../services/recommendation.service'
import { RoleService } from '../services/role.service'
import { UserProfileService } from '../services/user-profile.service'

export class QueryHandlerFactory {
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
  createQueryHandlers = (): BotQueryHandlers => {
    return {
      [QUERIES.response]: new Response(
        this.userService,
        this.userProfileRepository,
        this.recommendationService,
        this.userRepository,
        this.userProfileService
      ),
      [QUERIES.ignore]: new Ignore()
    } as BotQueryHandlers
  }
}
