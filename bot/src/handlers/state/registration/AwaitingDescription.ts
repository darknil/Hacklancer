import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { MESSAGES } from '../../../constants/messages'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'
import { KEYBOARDS } from '../../../constants/KeyBoards'

export class AwaitingDescriptionState implements UserStateHandler {
  constructor(private userRepository: UserRepository) {}
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

    if (message.length > 300) {
      await ctx.reply(MESSAGES[lang].registration.descriptionTooLong)
      return
    }

    this.userRepository.update(userId, {
      description: message,
      state: STATES.REGISTRATION.AWAITING_PHOTO
    })
    const userData = await this.userRepository.get(userId)
    if (userData?.photoURL) {
      await ctx.reply(MESSAGES[lang].registration.previousPhoto, {
        reply_markup: {
          keyboard: KEYBOARDS[lang].registration.usePhoto.keyboard,
          resize_keyboard: true,
          one_time_keyboard: true
        }
      })
      return
    }
    await ctx.reply(MESSAGES[lang].registration.sendPhoto)
  }
}
