import { Bot } from 'grammy'
import { ExternalUserService } from '../external/ExternalUserService'
import { CommandSubscriber } from '../handlers/CommandSubscriber'
import { MessageHandler } from '../handlers/MessageHandler'
import { StateSubscriber } from '../handlers/StateSubscriber'
import { UserRepository } from '../repositories/UserRepository'
import { UserService } from '../services/user.service'

export class ServiceConfig {
  static createServices(bot: Bot) {
    const userRepository = new UserRepository()
    const externalUserService = new ExternalUserService()
    const userService = new UserService(userRepository, externalUserService)
    const stateSubscriber = new StateSubscriber()
    const commandSubscriber = new CommandSubscriber(bot)
    const messageHandler = new MessageHandler(stateSubscriber, userService)

    return {
      userRepository,
      externalUserService,
      userService,
      stateSubscriber,
      commandSubscriber,
      messageHandler
    }
  }
}
