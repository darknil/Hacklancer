import { Context } from 'grammy'

export interface ICommandHandler {
  handle(ctx: Context): void | Promise<void>
}
