import { Context } from 'grammy'
import { UserService } from '../../services/user.service'
import { UserProfileRepository } from '../../repositories/UserProfileRepository'
import { RecommendationService } from '../../services/recommendation.service'
import { UserRepository } from '../../repositories/UserRepository'
import { UserProfileService } from '../../services/userProfile.service'
import { MESSAGES } from '../../constants/messages'
import { UserData } from '../../types/UserData'

export class Response {
  constructor(
    private userService: UserService,
    private userProfileRepository: UserProfileRepository,
    private recommendationService: RecommendationService,
    private userRepository: UserRepository,
    private userProfileService: UserProfileService
  ) {}
  async handle(ctx: Context, data: any): Promise<void> {
    console.log('response call back query')
    if (!ctx.callbackQuery?.data) return
    const userId = ctx.callbackQuery.from.id
    if (!userId) return

    const user = await this.userService.find(userId)
    if (!user) return
    const lang =
      (user.language_code ?? 'en').toLowerCase() === 'ru' ? 'ru' : 'en'

    if (!data) return
    const receiverId = Number(data)
    await this.editMessage(receiverId, lang, ctx)
    this.sendBackLike(user, receiverId, ctx)
  }
  async editMessage(
    receiverId: number,
    lang: 'en' | 'ru',
    ctx: Context
  ): Promise<void> {
    const receiver = await this.userService.find(receiverId)
    if (!receiver) return
    try {
      const message = MESSAGES[lang].sympathy(
        receiver?.nickname ?? '',
        receiver.username ?? ''
      )
      await ctx.editMessageText(message, {
        parse_mode: 'HTML'
      })
    } catch (error) {
      console.error('Ошибка при изменении сообщения:', error)
    }
  }
  async sendBackLike(
    user: UserData,
    receiverId: number,
    ctx: Context
  ): Promise<void> {
    const ProfileData = await this.userProfileService.find(user.chatId)
    const receiverData = await this.userService.find(receiverId)
    if (!receiverData) return
    const receiverLang =
      (receiverData.language_code ?? 'en').toLowerCase() === 'ru' ? 'ru' : 'en'
    if (ProfileData?.photoURL) {
      const caption = MESSAGES[receiverLang].profile(
        ProfileData?.nickname ?? '',
        ProfileData?.city ?? '',
        ProfileData?.description ?? '',
        ProfileData?.rolename ?? ''
      )
      await ctx.api.sendPhoto(receiverId, ProfileData?.photoURL, {
        caption,
        parse_mode: 'HTML'
      })
      ctx.api.sendMessage(
        receiverId,
        MESSAGES[receiverLang].sympathy(
          ProfileData.nickname,
          user?.username ?? ''
        )
      )
    }
  }
}
