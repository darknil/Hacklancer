import { Context } from 'grammy'
import { UserStateHandlers } from '../types/UserStateHandlers'
import UserRepository from '../repositories/UserRepository'

export class StateSubscriber {
  private handlers: UserStateHandlers | undefined
  registerHandlers(handlers: UserStateHandlers) {
    this.handlers = handlers
  }

  async handle(state: string, ctx: Context) {
    console.log('handlers :', this.handlers)
    if (!this.handlers) {
      await ctx.reply('Неподдерживаемое состояние.')
      return
    }

    const handler = this.handlers[state as keyof UserStateHandlers]
    if (handler) {
      // Если обработчик найден, вызываем его
      await handler.handle(ctx)
    } else {
      // Если обработчик не найден, отправляем сообщение о неподдерживаемом состоянии
      await ctx.reply('Неподдерживаемое состояние.')
    }
  }
}
