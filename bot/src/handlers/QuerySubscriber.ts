import { Context } from 'grammy'
import { BotQueryHandlers } from '../types/BotQueryHandlers'

export class QuerySubscriber {
  private handlers: BotQueryHandlers | undefined

  registerHandlers(handlers: BotQueryHandlers) {
    this.handlers = handlers
  }

  async handle(query: string, data: string, ctx: Context) {
    if (!this.handlers) {
      await ctx.reply('Неподдерживаемый запрос.')
      return
    }
    const handler = this.handlers[query as keyof BotQueryHandlers]
    if (handler) {
      await handler.handle(ctx, data)
    } else {
      await ctx.reply('нет обработчика')
    }
  }
}
