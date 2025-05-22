import { Bot } from 'grammy'
import { ExternalUserService } from '../external/ExternalUserService'
import { CommandSubscriber } from '../handlers/CommandSubscriber'
import { MessageHandler } from '../handlers/MessageHandler'
import { StateSubscriber } from '../handlers/StateSubscriber'
import { UserRepository } from '../repositories/UserRepository'
import { UserService } from '../services/user.service'
import UserSessionRepository from '../repositories/UserSessionRepository'

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
  static subscribeTTLExpiration(userService: UserService) {
    UserSessionRepository.subscribeToSessionExpiration(async (userId) => {
      console.log(`Сессия пользователя ${userId} истекла.`)

      const userData = await UserSessionRepository.getUserSession(userId)
      if (userData) {
        try {
          await userService.saveUser(userData)
          console.log(`Пользователь ${userId} успешно сохранён.`)
        } catch (err) {
          console.error(`Ошибка при сохранении пользователя ${userId}:`, err)
        }
      } else {
        console.warn(`Сессия для пользователя ${userId} не найдена.`)
      }
    })
  }
}
