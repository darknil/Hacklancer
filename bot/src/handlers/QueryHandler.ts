import { Context } from 'grammy'
import { UserService } from '../services/user.service'
import { QuerySubscriber } from './QuerySubscriber'

export class QueryHandler {
  constructor(
    private querySubscriber: QuerySubscriber,
    private userService: UserService
  ) {}

  async handle(ctx: Context) {
    if (!ctx.callbackQuery?.data) return
    const [query, data] = ctx.callbackQuery.data.split(':')
    if (!query || !data) {
      await ctx.reply('Неверный формат callback данных.')
      return
    }
    const userData = {
      chatId: ctx.callbackQuery.from.id,
      username: ctx.callbackQuery?.from.username || undefined,
      first_name: ctx.callbackQuery?.from.first_name || undefined,
      last_name: ctx.callbackQuery.from.last_name || undefined,
      language_code: ctx.callbackQuery.from.language_code || undefined
    }
    await this.userService.findOrCreate(userData)
    console.log('handle query : ', query, 'data:', data)
    await this.querySubscriber.handle(query, data, ctx)
  }
}
