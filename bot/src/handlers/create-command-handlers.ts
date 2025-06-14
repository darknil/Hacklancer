import { ExternalRecommendationService } from '../external/external-recommendation.service'
import { ExternalRoleService } from '../external/external-role.service'
import { ExternalUserService } from '../external/external-user.service'
import { RoleRepository } from '../repositories/role.repository'
import { UserProfileRepository } from '../repositories/user-profile.repository'
import { UserRepository } from '../repositories/user.repository'
import { RecommendationService } from '../services/recommendation.service'
import { RoleService } from '../services/role.service'
import { UserService } from '../services/user.service'
import { BotCommandHandlers } from '../types/bot-command-handlers.type'
import { StartCommand } from './commands/start-command'

export class CommandHandlerFactory {
  private userRepository: UserRepository
  private externalUserService: ExternalUserService
  private userService: UserService
  private externalRecommendationService: ExternalRecommendationService
  private userProfileRepository: UserProfileRepository
  private roleRepository: RoleRepository
  private recommendationService: RecommendationService
  private roleService: RoleService
  private externalRoleService: ExternalRoleService

  constructor() {
    this.userRepository = new UserRepository()
    this.externalUserService = new ExternalUserService()
    this.userService = new UserService(
      this.userRepository,
      this.externalUserService
    )
    this.externalRecommendationService = new ExternalRecommendationService()
    this.userProfileRepository = new UserProfileRepository()
    this.roleRepository = new RoleRepository()
    this.externalRoleService = new ExternalRoleService()
    this.roleService = new RoleService(
      this.roleRepository,
      this.externalRoleService
    )
    this.recommendationService = new RecommendationService(
      this.externalRecommendationService,
      this.externalUserService,
      this.userProfileRepository,
      this.roleService,
      this.userRepository
    )
  }

  createCommandHandlers = (): BotCommandHandlers => ({
    start: new StartCommand(
      this.userService,
      this.userRepository,
      this.recommendationService
    )
  })
}
