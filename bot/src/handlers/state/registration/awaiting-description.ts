import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { MESSAGES } from '../../../constants/messages'
import { UserRepository } from '../../../repositories/user.repository'
import { STATES } from '../../../constants/states'
import { KEYBOARDS } from '../../../constants/keyboards'
import { UserService } from '../../../services/user.service'

export class AwaitingDescriptionState implements UserStateHandler {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService
  ) {}
  async handle(ctx: Context): Promise<void> {
    const userId = ctx.from?.id
    if (!userId) return

    const user = await this.userService.find(userId)
    if (!user) return
    const lang =
      (user.language_code ?? 'en').toLowerCase() === 'ru' ? 'ru' : 'en'

    const message = ctx.message?.text
    if (typeof message !== 'string') {
      await ctx.reply(MESSAGES[lang].registration.enterDescription)
      return
    }

    if (message.length > 300) {
      await ctx.reply(MESSAGES[lang].registration.descriptionTooLong)
      return
    }

    const trimmed = message.trim()
    const isTooLong = trimmed.length > 300
    const containsHtml = /<[^>]+>/.test(trimmed)

    if (isTooLong || containsHtml) {
      await ctx.reply(MESSAGES[lang].registration.invalidDescription)
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
