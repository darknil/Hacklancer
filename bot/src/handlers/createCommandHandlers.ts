import { ExternalRecommendationService } from '../external/ExternalRecommendationService'
import { ExternalUserService } from '../external/ExternalUserService'
import { RoleRepository } from '../repositories/RoleRepository'
import { UserProfileRepository } from '../repositories/UserProfileRepository'
import { UserRepository } from '../repositories/UserRepository'
import { RecommendationService } from '../services/recommendation.service'
import { UserService } from '../services/user.service'
import { BotCommandHandlers } from '../types/BotCommandHandlers'
import { StartCommand } from './commands/StartCommand'

export class CommandHandlerFactory {
  private userRepository: UserRepository
  private externalUserService: ExternalUserService
  private userService: UserService
  private externalRecommendationService: ExternalRecommendationService
  private userProfileRepository: UserProfileRepository
  private roleRepository: RoleRepository
  private recommendationService: RecommendationService

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
    this.recommendationService = new RecommendationService(
      this.externalRecommendationService,
      this.externalUserService,
      this.userProfileRepository,
      this.roleRepository,
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
