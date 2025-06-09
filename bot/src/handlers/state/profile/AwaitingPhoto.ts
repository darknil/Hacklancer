import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'
import { RoleService } from '../../../services/role.service'
import { KEYBOARDS } from '../../../constants/KeyBoards'
import { UserService } from '../../../services/user.service'

export class ProfileAwaitingPhotoState implements UserStateHandler {
  MAX_SIZE: number

  constructor(
    private userRepository: UserRepository,
    private roleService: RoleService,
    private userService: UserService
  ) {
    this.MAX_SIZE = 1024 * 1024 * 5
  }

  async handle(ctx: Context): Promise<void> {
    const userId = ctx.message?.chat?.id
    if (!userId) return
    const user = await this.userService.find(userId)
    if (!user) return
    const lang =
      (user.language_code ?? 'en').toLowerCase() === 'ru' ? 'ru' : 'en'
    const photo = ctx.message?.photo

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
