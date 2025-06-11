import { Bot } from 'grammy'
import { ExternalUserService } from '../external/ExternalUserService'
import { CommandSubscriber } from '../handlers/CommandSubscriber'
import { MessageHandler } from '../handlers/MessageHandler'
import { StateSubscriber } from '../handlers/StateSubscriber'
import { UserRepository } from '../repositories/UserRepository'
import { UserService } from '../services/user.service'
import UserSessionRepository from '../repositories/UserSessionRepository'
import { PollHandler } from '../handlers/PollHandler'
import { QuerySubscriber } from '../handlers/QuerySubscriber'
import { QueryHandler } from '../handlers/QueryHandler'

export class ServiceConfig {
  static createServices(bot: Bot) {
    const userRepository = new UserRepository()
    const externalUserService = new ExternalUserService()
    const userService = new UserService(userRepository, externalUserService)
    const stateSubscriber = new StateSubscriber()
    const commandSubscriber = new CommandSubscriber(bot)
    const querySubscriber = new QuerySubscriber()
    const messageHandler = new MessageHandler(stateSubscriber, userService)
    const pollHandler = new PollHandler(stateSubscriber, userService)
    const queryHandler = new QueryHandler(querySubscriber, userService)
    return {
      userRepository,
      externalUserService,
      userService,
      stateSubscriber,
      commandSubscriber,
      querySubscriber,
      messageHandler,
      pollHandler,
      queryHandler
    }
  }
  static subscribeTTLExpiration(userService: UserService) {
    UserSessionRepository.subscribeToSessionExpiration(
      async (userId, userData) => {
        if (userData) {
          await userService.saveUser(userData)
        } else {
          console.warn(`Нет данных для пользователя ${userId}`)
        }
      }
    )
  }
}
