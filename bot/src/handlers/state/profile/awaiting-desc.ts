import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { MESSAGES } from '../../../constants/messages'
import { KEYBOARDS } from '../../../constants/keyboards'
import { IMAGES_URL } from '../../../constants/images'
import { UserService } from '../../../services/user.service'
import { RoleService } from '../../../services/role.service'
import { UserRepository } from '../../../repositories/user.repository'
import { STATES } from '../../../constants/states'

export class ProfileAwaitingDescriptionState implements UserStateHandler {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private userRepository: UserRepository
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

    await this.userRepository.update(userId, {
      description: message,
      state: STATES.PROFILE.AWAITING_ACTION
    })
    await this.sendProfile(userId, lang, ctx)
  }
  private async sendProfile(userId: number, lang: 'ru' | 'en', ctx: Context) {
    const userData = await this.userService.find(userId)
    if (!userData) return
    const userRole = await this.roleService.findRole(userData?.roleId ?? '')
    const caption = MESSAGES[lang].profile(
      userData?.nickname ?? '',
      userData?.city ?? '',
      userData?.description ?? '',
      userRole?.name ?? ''
    )
    if (userData?.photoURL) {
      await ctx.api.sendPhoto(userId, userData?.photoURL, {
        caption,
        parse_mode: 'HTML',
        reply_markup: {
          keyboard: KEYBOARDS.profile.awaitingAction.keyboard,
          resize_keyboard: true,
          one_time_keyboard: true
        }
      })
      await ctx.reply(MESSAGES[lang].profileOptions)
    }
  }
}
