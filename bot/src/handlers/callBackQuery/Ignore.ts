import { Context } from 'grammy'

export class Ignore {
  constructor() {}
  async handle(ctx: Context, data: any): Promise<void> {
    console.log('ignore call back query')
    try {
      await ctx.deleteMessage()
    } catch (error) {
      console.log('error ignore call back query', error)
    }
  }
}
