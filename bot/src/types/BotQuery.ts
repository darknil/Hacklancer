import { Context } from 'grammy'

export interface BotQuery {
  handle(ctx: Context): Promise<void>
}
