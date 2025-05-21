import { Context } from 'grammy'
import { UserStateHandler } from '../../../Interfaces/IUserStateHandler'

export class EnterDescriptionState implements UserStateHandler {
  async handle(ctx: Context): Promise<void> {
    const userId = ctx.from?.id.toString()
    if (!userId) return

    const name = ctx.message?.text
    if (!name) {
      await ctx.reply('Пожалуйста, отправьте своё имя текстом.')
      return
    }

    await ctx.reply(`Имя "${name}" сохранено. Сколько вам лет?`)
  }
}
