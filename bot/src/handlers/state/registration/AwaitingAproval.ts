import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'
import { KEYBOARDS } from '../../../constants/KeyBoards'
import { IMAGES_URL } from '../../../constants/images'

export class AwaitingAprovalState implements UserStateHandler {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async handle(ctx: Context): Promise<void> {
    const userId = ctx.from?.id
    if (!userId) return

    const userLang = ctx.from?.language_code

    const lang = userLang === 'ru' ? 'ru' : 'en'

    const message = ctx.message?.text
    if (typeof message !== 'string') {
      return
    }
    if (message === KEYBOARDS[lang].registration.aproval.yes) {
      await ctx.api.sendAnimation(userId, IMAGES_URL.main, {
        caption: MESSAGES[lang].main,
        reply_markup: {
          keyboard: KEYBOARDS.main.keyboard,
          resize_keyboard: true,
          one_time_keyboard: true
        }
      })
    }
    if (message === KEYBOARDS[lang].registration.aproval.no) {
      this.userRepository.update(userId, {
        state: STATES.REGISTRATION.AWAITING_NAME
      })

      await ctx.reply(MESSAGES[lang].registration.enterName)
    }
  }
}
