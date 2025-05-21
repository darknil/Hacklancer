import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'

export class AwaitingNameState implements UserStateHandler {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async handle(ctx: Context): Promise<void> {
    const userId = ctx.from?.id.toString()
    if (!userId) return

    const nickname = ctx.message?.text
    if (!nickname) {
      await ctx.reply('Пожалуйста, отправьте своё имя текстом.')
      return
    }

    // Сохраняем имя пользователя
    await this.userRepository.update(userId, { nickname })

    // Меняем состояние на AWAITING_CITY
    await this.userRepository.setState(
      userId,
      STATES.REGISTRATION.AWAITING_CITY
    )

    await ctx.reply(`Имя "${name}" сохранено. Сколько вам лет?`)
  }
}
