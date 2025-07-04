import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/user.repository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'
import { RoleService } from '../../../services/role.service'
import { KEYBOARDS } from '../../../constants/keyboards'

export class AwaitingPhotoState implements UserStateHandler {
  MAX_SIZE: number

  constructor(
    private userRepository: UserRepository,
    private roleService: RoleService
  ) {
    this.MAX_SIZE = 1024 * 1024 * 5
  }

  async handle(ctx: Context): Promise<void> {
    const userId = ctx.message?.chat?.id
    if (!userId) return
    const userLang = ctx.from?.language_code
    const lang = userLang === 'ru' ? 'ru' : 'en'
    const photo = ctx.message?.photo
    const userData = await this.userRepository.get(userId)

    if (
      !photo &&
      ctx.message?.text === KEYBOARDS[lang].registration.usePhoto.yes
    ) {
      this.userRepository.update(userId, {
        state: STATES.REGISTRATION.AWAITING_APPROVAL
      })
      await this.sendProfile(userId, lang, ctx)
      return
    }

    if (!photo) {
      await ctx.reply(MESSAGES[lang].registration.sendPhoto)
      return
    }

    if (photo[0]?.file_size && photo[0].file_size > this.MAX_SIZE) {
      await ctx.reply(MESSAGES[lang].registration.photoMaxSize)
      return
    }

    await this.userRepository.update(userId, {
      photoURL: photo[0].file_id,
      state: STATES.REGISTRATION.AWAITING_APPROVAL
    })

    await this.sendProfile(userId, lang, ctx)
  }
  private async sendProfile(userId: number, lang: 'ru' | 'en', ctx: Context) {
    const userData = await this.userRepository.get(userId)
    const userRole = await this.roleService.findRole(userData?.roleId ?? '')
    const caption = MESSAGES[lang].profile(
      userData?.nickname ?? '',
      userData?.city ?? '',
      userData?.description ?? '',
      userRole?.name ?? ''
    )
    await ctx.reply(MESSAGES[lang].registration.aproval)
    if (userData?.photoURL) {
      await ctx.api.sendPhoto(userId, userData?.photoURL, {
        caption,
        parse_mode: 'HTML',
        reply_markup: {
          keyboard: KEYBOARDS[lang].registration.aproval.keyboard,
          resize_keyboard: true,
          one_time_keyboard: true
        }
      })
    }
  }
}
