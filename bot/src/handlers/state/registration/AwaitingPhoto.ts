import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'

export class AwaitingPhotoState implements UserStateHandler {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async handle(ctx: Context): Promise<void> {
    const userId = ctx.from?.id
    if (!userId) return
    const userLang = ctx.from?.language_code
    const lang = userLang === 'ru' ? 'ru' : 'en'

    const photo = ctx.message?.photo
    if (!photo) {
      await ctx.reply(MESSAGES[lang].registration.sendPhoto)
      return
    }
    const MAX_SIZE = 1024 * 1024 * 5
    if (photo[0]?.file_size && photo[0].file_size > MAX_SIZE) {
      await ctx.reply(MESSAGES[lang].registration.photoMaxSize)
      return
    }

    this.userRepository.update(userId, {
      photoURL: photo[0].file_id,
      state: STATES.REGISTRATION.AWAITING_CITY
    })

    await ctx.reply(MESSAGES[lang].registration.enterCity)
  }
}
