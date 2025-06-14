import { Bot } from 'grammy'
import { ExternalUserService } from '../external/external-user.service'
import { CommandSubscriber } from '../handlers/command-subscriber'
import { MessageHandler } from '../handlers/message.handler'
import { StateSubscriber } from '../handlers/state-subscriber'
import { UserRepository } from '../repositories/user.repository'
import { UserService } from '../services/user.service'
import UserSessionRepository from '../repositories/user-session.repository'
import { PollHandler } from '../handlers/poll.handler'
import { QuerySubscriber } from '../handlers/querys-subscriber'
import { QueryHandler } from '../handlers/query.handler'

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
