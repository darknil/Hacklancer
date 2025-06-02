import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'
import { KEYBOARDS } from '../../../constants/KeyBoards'
import { IMAGES_URL } from '../../../constants/images'

export class MainAwaitingActionState implements UserStateHandler {
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
      await ctx.api.sendAnimation(userId, IMAGES_URL.main, {
        caption: MESSAGES[lang].main,
        reply_markup: {
          keyboard: KEYBOARDS.main.keyboard,
          resize_keyboard: true,
          one_time_keyboard: true
        }
      })
      return
    }

    switch (message) {
      case KEYBOARDS.main.matching:
        await ctx.reply('profiles.')
        break
      case KEYBOARDS.main.myProfile:
        await ctx.reply('my profile.')
        break
      case KEYBOARDS.main.hackathons:
        await ctx.reply('hackathons coming soon.')
        break
      default:
        await ctx.api.sendAnimation(userId, IMAGES_URL.main, {
          caption: MESSAGES[lang].main,
          reply_markup: {
            keyboard: KEYBOARDS.main.keyboard,
            resize_keyboard: true,
            one_time_keyboard: true
          }
        })
        break
    }
  }
}
