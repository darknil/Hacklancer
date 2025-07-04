import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/user.repository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'
import { KEYBOARDS } from '../../../constants/keyboards'
import { IMAGES_URL } from '../../../constants/images'
import { UserService } from '../../../services/user.service'
import { ExternalUserService } from '../../../external/external-user.service'

export class AwaitingAprovalState implements UserStateHandler {
  constructor(
    private userRepository: UserRepository,
    private userSerice: UserService
  ) {}

  async handle(ctx: Context): Promise<void> {
    const userId = ctx.from?.id
    if (!userId) return

    const user = await this.userSerice.find(userId)
    if (!user) return
    const lang =
      (user.language_code ?? 'en').toLowerCase() === 'ru' ? 'ru' : 'en'

    const message = ctx.message?.text
    if (typeof message !== 'string') {
      return
    }
    if (message === KEYBOARDS[lang].registration.aproval.yes) {
      this.userRepository.update(userId, {
        state: STATES.REGISTRATION.AWAITING_NAME
      })
      const userData = await this.userRepository.get(userId)
      if (userData) this.userSerice.saveUser(userData)
      this.userRepository.update(userId, {
        state: STATES.MAIN.AWAITING_ACTION
      })
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
