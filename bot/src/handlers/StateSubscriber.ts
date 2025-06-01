import { Context } from 'grammy'
import { UserStateHandlers } from '../types/UserStateHandlers'

export class StateSubscriber {
  private handlers: UserStateHandlers | undefined
  registerHandlers(handlers: UserStateHandlers) {
    this.handlers = handlers
  }

  async handle(state: string, ctx: Context) {
    if (!this.handlers) {
      await ctx.reply('Неподдерживаемое состояние.')
      return
    }

    const handler = this.handlers[state as keyof UserStateHandlers]
    if (handler) {
      await handler.handle(ctx)
    } else {
      await ctx.reply('нет обработчика')
    }
  }
}
