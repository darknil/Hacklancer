import { Bot, Context } from 'grammy'
import dotenv from 'dotenv'
import UserSessionRepository from './src/repositories/UserSessionRepository'
import { CommandSubscriber } from './src/handlers/CommandSubscriber'
import { createCommandHandlers } from './src/handlers/createCommandHandlers'

dotenv.config()

class TGBot {
  private bot: Bot
  commandSubscriber: CommandSubscriber

  constructor() {
    const token = process.env.BOT_TOKEN

    if (!token) {
      throw new Error('BOT_TOKEN is not defined in environment variables.')
    }

    this.bot = new Bot(token)
    this.commandSubscriber = new CommandSubscriber(this.bot)
    this.registerCommands()
    this.registerMessageHandler()
  }

  private registerCommands() {
    const handlers = createCommandHandlers()
    this.commandSubscriber.subscribe(handlers)
  }

  private registerMessageHandler() {
    this.bot.on('message', async (ctx: Context) => {
      await this.handleMessage(ctx)
    })
  }
  private async handleMessage(ctx: Context) {
    if (!ctx.message?.chat || !ctx.from) return

    const userId = ctx.from.id.toString()
    const sessionTTL = parseInt(process.env.SESSION_TTL || '60', 10)

    await UserSessionRepository.saveUserSession(
      userId,
      {
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name
      },
      sessionTTL
    )

    await ctx.reply(
      `Сообщение получено, пользователь и сессия сохранены на ${sessionTTL} секунд.`
    )
  }
  public start() {
    // Подписка на истечение TTL сессии
    UserSessionRepository.subscribeToSessionExpiration((userId) => {
      console.log(
        `Сессия пользователя ${userId} истекла — здесь можно выполнить сохранение в БД`
      )
      // saveToDB(userId)
    })

    this.bot.start()
    console.log('=========================')
    console.log('Bot is running')
    console.log('=========================')
  }
}

const myBot = new TGBot()
myBot.start()
