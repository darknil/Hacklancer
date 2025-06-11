import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'
import { UserRepository } from '../../../repositories/UserRepository'
import { STATES } from '../../../constants/states'
import { MESSAGES } from '../../../constants/messages'

export class AwaitingNameState implements UserStateHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(ctx: Context): Promise<void> {
    const userId = ctx.from?.id
    if (!userId) return

    const userLang = ctx.from?.language_code

    const lang = userLang === 'ru' ? 'ru' : 'en'

    const message = ctx.message?.text

    if (typeof message !== 'string') {
      await ctx.reply(MESSAGES[lang].registration.enterName)
      return
    }
    const trimmed = message.trim()
    const isTooLong = trimmed.length > 30
    const containsHtml = /<[^>]+>/.test(trimmed)
    const hasNewLines = /\r|\n/.test(trimmed)
    if (isTooLong || containsHtml || hasNewLines) {
      await ctx.reply(MESSAGES[lang].registration.invalidName)
      return
    }

    this.userRepository.update(userId, {
      nickname: message,
      state: STATES.REGISTRATION.AWAITING_CITY
    })

    await ctx.reply(MESSAGES[lang].registration.enterCity)
  }
}
