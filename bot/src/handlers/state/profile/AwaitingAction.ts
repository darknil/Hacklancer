import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/UserRepository'
import { MESSAGES } from '../../../constants/messages'
import { KEYBOARDS } from '../../../constants/KeyBoards'
import { IMAGES_URL } from '../../../constants/images'
import { RoleService } from '../../../services/role.service'
import { STATES } from '../../../constants/states'
import { UserService } from '../../../services/user.service'

export class ProfileAwaitingActionState implements UserStateHandler {
  constructor(
    private userRepository: UserRepository,
    private roleService: RoleService,
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
      case KEYBOARDS.profile.awaitingAction.fillOutAgain:
        await this.userRepository.setState(
          user.chatId,
          STATES.REGISTRATION.AWAITING_NAME
        )

        await ctx.reply(MESSAGES[lang].registration.enterName)
        break

      case KEYBOARDS.profile.awaitingAction.changeDescription:
        await this.userRepository.setState(
          user.chatId,
          STATES.PROFILE.EDIT_DESCRIPTION
        )
        await ctx.reply(MESSAGES[lang].registration.enterDescription)
        break

      case KEYBOARDS.profile.awaitingAction.changePhoto:
        await this.userRepository.setState(
          user.chatId,
          STATES.PROFILE.EDIT_PHOTO
        )
        await ctx.reply(MESSAGES[lang].registration.sendPhoto)
        break

      case KEYBOARDS.profile.awaitingAction.home:
        this.userRepository.update(userId, {
          state: STATES.MAIN.AWAITING_ACTION
        })
        await this.sendHomePage(userId, lang, ctx)
        break

      default:
        await this.sendProfile(userId, lang, ctx)
        break
    }
  }

  async sendHomePage(userId: number, lang: 'ru' | 'en', ctx: Context) {
    await ctx.api.sendAnimation(userId, IMAGES_URL.main, {
      caption: MESSAGES[lang].main,
      reply_markup: {
        keyboard: KEYBOARDS.main.keyboard,
        resize_keyboard: true,
        one_time_keyboard: true
      }
    })
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
