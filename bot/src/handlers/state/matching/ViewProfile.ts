import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'
import { KEYBOARDS } from '../../../constants/KeyBoards'
import { IMAGES_URL } from '../../../constants/images'
import { UserService } from '../../../services/user.service'
import { UserProfileRepository } from '../../../repositories/UserProfileRepository'
import { RecommendationService } from '../../../services/recommendation.service'

export class ViewProfileState implements UserStateHandler {
  constructor(
    private userService: UserService,
    private userProfileRepository: UserProfileRepository,
    private recommendationService: RecommendationService,
    private userRepository: UserRepository
  ) {}

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
      case KEYBOARDS.swiping.like:
        await ctx.reply('like coming soon.')
        break
      case KEYBOARDS.swiping.next:
        await this.sendMatchProfile(userId, lang, ctx)
        break
      case KEYBOARDS.swiping.settings:
        await ctx.reply('settings coming soon.')
        break
      case KEYBOARDS.swiping.home:
        this.userRepository.update(userId, {
          state: STATES.MAIN.AWAITING_ACTION
        })
        await this.sendHomePage(userId, ctx)
        break
      default:
        await this.sendLastViewedProfile(userId, lang, ctx)
        break
    }
  }

  async sendHomePage(userId: number, ctx: Context) {
    const userLang = ctx.from?.language_code
    const lang = userLang === 'ru' ? 'ru' : 'en'

    await ctx.api.sendAnimation(userId, IMAGES_URL.main, {
      caption: MESSAGES[lang].main,
      reply_markup: {
        keyboard: KEYBOARDS.main.keyboard,
        resize_keyboard: true,
        one_time_keyboard: true
      }
    })
  }

  async sendMatchProfile(userId: number, lang: 'ru' | 'en', ctx: Context) {
    const ProfileData = await this.recommendationService.getNextProfile(userId)
    const caption = MESSAGES[lang].profile(
      ProfileData?.nickname ?? '',
      ProfileData?.city ?? '',
      ProfileData?.description ?? '',
      ProfileData?.rolename ?? ''
    )
    if (ProfileData?.photoURL) {
      await ctx.api.sendPhoto(userId, ProfileData?.photoURL, {
        caption,
        parse_mode: 'HTML',
        reply_markup: {
          keyboard: KEYBOARDS.swiping.keyboard,
          resize_keyboard: true,
          one_time_keyboard: true
        }
      })
    }
  }

  async sendLastViewedProfile(userId: number, lang: 'ru' | 'en', ctx: Context) {
    const lastViewedId = await this.userService.getLastViewedId(userId)
    if (!lastViewedId) {
      this.userRepository.update(userId, {
        state: STATES.MAIN.AWAITING_ACTION
      })
      await this.sendHomePage(userId, ctx)
      return
    }
    const ProfileData = await this.userProfileRepository.get(lastViewedId)
    const caption = MESSAGES[lang].profile(
      ProfileData?.nickname ?? '',
      ProfileData?.city ?? '',
      ProfileData?.description ?? '',
      ProfileData?.rolename ?? ''
    )
    if (ProfileData?.photoURL) {
      await ctx.api.sendPhoto(userId, ProfileData?.photoURL, {
        caption,
        parse_mode: 'HTML',
        reply_markup: {
          keyboard: KEYBOARDS.swiping.keyboard,
          resize_keyboard: true,
          one_time_keyboard: true
        }
      })
    }
  }
}
