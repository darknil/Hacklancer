import { Context } from 'grammy'
import { StateSubscriber } from './state-subscriber'
import { UserService } from '../services/user.service'

export class PollHandler {
  constructor(
    private stateSubscriber: StateSubscriber,
    private userService: UserService
  ) {}

  async handle(ctx: Context) {
    if (!ctx.pollAnswer?.user) return

    const userData = {
      chatId: ctx.pollAnswer.user.id,
      username: ctx.pollAnswer.user.username || undefined,
      first_name: ctx.pollAnswer.user.first_name || undefined,
      last_name: ctx.pollAnswer.user.last_name || undefined,
      language_code: ctx.pollAnswer.user.language_code || undefined
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
