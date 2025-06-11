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
import { UserProfileService } from '../../../services/userProfile.service'

export class ViewProfileState implements UserStateHandler {
  constructor(
    private userService: UserService,
    private userProfileRepository: UserProfileRepository,
    private recommendationService: RecommendationService,
    private userRepository: UserRepository,
    private userProfileService: UserProfileService
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
      case KEYBOARDS.swiping.like:
        await this.sendLike(userId, ctx)
        await ctx.reply(MESSAGES[lang].messageSend)
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
  async sendLike(userId: number, ctx: Context) {
    const ProfileData = await this.userProfileService.find(userId)
    const receiverId = await this.userService.getLastViewedId(userId)
    console.log(`[${new Date().toISOString()}] receiver ID: ${receiverId}`)
    if (!receiverId)
      return console.log(`[${new Date().toISOString()}] receiver id not found`)

    const receiverData = await this.userService.find(receiverId)
    if (!receiverData)
      return console.log(
        `[${new Date().toISOString()}] receiver data not found`
      )

    const receiverLang =
      (receiverData.language_code ?? 'en').toLowerCase() === 'ru' ? 'ru' : 'en'
    const caption = MESSAGES[receiverLang].profile(
      ProfileData?.nickname ?? '',
      ProfileData?.city ?? '',
      ProfileData?.description ?? '',
      ProfileData?.rolename ?? ''
    )
    if (ProfileData?.photoURL) {
      await ctx.api.sendPhoto(receiverId, ProfileData?.photoURL, {
        caption,
        parse_mode: 'HTML'
      })
      await ctx.api.sendMessage(
        receiverId,
        MESSAGES[receiverLang].like(ProfileData?.nickname ?? ''),
        {
          reply_markup: KEYBOARDS[receiverLang].liked(userId)
        }
      )
      return
    }
    console.log(
      `[${new Date().toISOString()}] profile data image not found. profileData :`,
      ProfileData
    )
  }
}
