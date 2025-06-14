import { Context } from 'grammy'
import { StateSubscriber } from './state-subscriber'
import { UserService } from '../services/user.service'

export class MessageHandler {
  constructor(
    private stateSubscriber: StateSubscriber,
    private userService: UserService
  ) {}

  async handle(ctx: Context) {
    if (!ctx.message?.chat || !ctx.from) return

    const userData = {
      chatId: ctx.from.id,
      username: ctx.from.username || undefined,
      first_name: ctx.from.first_name || undefined,
      last_name: ctx.from.last_name || undefined,
      language_code: ctx.from.language_code || undefined
    }
    const user = await this.userService.findOrCreate(userData)
    if (!user.state) {
      console.error(
        `Не удалось найти или создать пользователя ${userData.chatId}`
      )
      return
    }

    await this.stateSubscriber.handle(user.state, ctx)
  }
}
