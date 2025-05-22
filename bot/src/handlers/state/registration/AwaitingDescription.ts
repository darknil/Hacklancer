import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { MESSAGES } from '../../../constants/messages'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'

export class AwaitingDescriptionState implements UserStateHandler {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }
  async handle(ctx: Context): Promise<void> {
    const userId = ctx.from?.id.toString()
    if (!userId) return

    const userLang = ctx.from?.language_code

    const lang = userLang === 'ru' ? 'ru' : 'en'

    const message = ctx.message?.text
    if (typeof message !== 'string') {
      await ctx.reply(MESSAGES[lang].registration.enterDescription)
      return
    }

    this.userRepository.update(userId, {
      description: message,
      state: STATES.REGISTRATION.AWAITING_PHOTO
    })

    const userData = await this.userRepository.get(userId)
    console.log(userData)
    await ctx.reply(
      MESSAGES[lang].registration.registered(
        userData?.nickname,
        userData?.city,
        userData?.description
      )
    )
  }
}
