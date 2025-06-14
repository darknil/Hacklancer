// bot/CommandSubscriber.ts
import { Bot } from 'grammy'
import { BotCommandHandlers } from '../types/bot-command-handlers.type'

export class CommandSubscriber {
  constructor(private bot: Bot) {}

  subscribe(handlers: BotCommandHandlers) {
    for (const [command, handler] of Object.entries(handlers)) {
      this.bot.command(command, (ctx) => handler.handle(ctx))
    }
  }
}
