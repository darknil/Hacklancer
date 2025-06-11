import { Context } from 'grammy'

export interface ICallBackQueryHandler {
  handle(ctx: Context, data: any): void | Promise<void>
}
