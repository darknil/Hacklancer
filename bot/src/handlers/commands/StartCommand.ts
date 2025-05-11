// bot/src/handlers/commands/StartCommand.ts
import { BotCommand } from '../../types/BotCommand'
import { Context } from 'grammy'

export class StartCommand implements BotCommand {
  async handle(ctx: Context): Promise<void> {
    await ctx.reply('Привет! Я бот.')
  }
}
