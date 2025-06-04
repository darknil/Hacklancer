import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'
import { KEYBOARDS } from '../../../constants/KeyBoards'
import { IMAGES_URL } from '../../../constants/images'
import { RecommendationService } from '../../../services/recommendation.service'

export class MainAwaitingActionState implements UserStateHandler {
  constructor(
    private userRepository: UserRepository,
    private recommendationService: RecommendationService
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
      case KEYBOARDS.main.matching:
        this.userRepository.update(userId, {
          state: STATES.MATCHING.VIEW_PROFILE
        })
        this.sendMatchProfile(userId, lang, ctx)

        break
      case KEYBOARDS.main.myProfile:
        await ctx.reply('my profile.')
        break
      case KEYBOARDS.main.hackathons:
        await ctx.reply('hackathons coming soon.')
        break
      default:
        this.userRepository.update(userId, {
          state: STATES.MAIN.AWAITING_ACTION
        })
        await this.sendHomePage(userId, lang, ctx)
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
}
