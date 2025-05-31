import { Context } from 'grammy'

export interface UserStateHandler {
  handle(ctx: Context): Promise<void>
}
