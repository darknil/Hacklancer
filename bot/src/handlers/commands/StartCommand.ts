import { BotCommand } from '../../types/BotCommand'
import { Context } from 'grammy'
import { MESSAGES } from '../../constants/messages'
import { UserRepository } from '../../repositories/UserRepository'
import { STATES } from '../../constants/states'
import { UserService } from '../../services/user.service'
import { ExternalUserService } from '../../external/ExternalUserService'
import { IMAGES_URL } from '../../constants/images'
import { KEYBOARDS } from '../../constants/KeyBoards'
import { RecommendationService } from '../../services/recommendation.service'
import { ExternalRecommendationService } from '../../external/ExternalRecommendationService'
import { UserProfileRepository } from '../../repositories/UserProfileRepository'
import { RoleRepository } from '../../repositories/RoleRepository'

export class StartCommand implements BotCommand {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly recommendationService: RecommendationService
  ) {}

  async handle(ctx: Context): Promise<void> {
    if (!ctx.from) return
    const userData = {
      chatId: ctx.from.id,
      username: ctx.from.username || undefined,
      first_name: ctx.from.first_name || undefined,
      last_name: ctx.from.last_name || undefined,
      language_code: ctx.from.language_code || undefined
    }
    const user = await this.userService.findOrCreate(userData)

    const lang = user.language_code === 'ru' ? 'ru' : 'en'

    const userState = await this.userRepository.getState(user.chatId)
    if (userState?.group === 'registration') {
      await this.userRepository.setState(
        user.chatId,
        STATES.REGISTRATION.AWAITING_NAME
      )

      await ctx.reply(MESSAGES[lang].registration.welcome)
      await ctx.reply(MESSAGES[lang].registration.enterName)
      return
    }

    this.userRepository.update(userData.chatId, {
      state: STATES.MAIN.AWAITING_ACTION
    })
    this.recommendationService.initializeUserSession(user.chatId)
    await ctx.api.sendAnimation(userData.chatId, IMAGES_URL.main, {
      caption: MESSAGES[lang].main,
      reply_markup: {
        keyboard: KEYBOARDS.main.keyboard,
        resize_keyboard: true,
        one_time_keyboard: true
      }
    })
  }
}
