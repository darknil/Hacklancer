import { Context } from 'grammy'

export interface BotCommand {
  handle(ctx: Context): Promise<void>
}
