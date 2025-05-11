import { Bot, Context } from 'grammy'
import dotenv from 'dotenv'
import UserSessionRepository from './src/repositories/UserSessionRepository'
import { CommandSubscriber } from './src/handlers/CommandSubscriber'
import { createCommandHandlers } from './src/handlers/createCommandHandlers'
import { StateSubscriber } from './src/handlers/StateSubscriber'
import { createStateHandlers } from './src/handlers/createStateHandlers'
import UserRepository from './src/repositories/UserRepository'

dotenv.config()

class TGBot {
  private bot: Bot
  commandSubscriber: CommandSubscriber
  stateSubscriber: StateSubscriber

  constructor() {
    const token = process.env.BOT_TOKEN

    if (!token) {
      throw new Error('BOT_TOKEN is not defined in environment variables.')
    }

    this.bot = new Bot(token)
    this.commandSubscriber = new CommandSubscriber(this.bot)
    this.stateSubscriber = new StateSubscriber()

    this.registerCommands()

    this.registerMessageHandler()

    const stateHandlers = createStateHandlers()
    this.stateSubscriber.registerHandlers(stateHandlers)
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
    const Data = {
      username: ctx.from.username || undefined,
      first_name: ctx.from.first_name || undefined,
      last_name: ctx.from.last_name || undefined,
      language_code: ctx.from.language_code || undefined
    }
    const userData = await UserRepository.findOrCreate(userId, Data)
    if (!userData.state) {
      console.error(`Не удалось найти или создать пользователя ${userId}`)
      return
    }
    await this.stateSubscriber.handle(userData.state, ctx)
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
    console.log('Bot is running:@Hacklancer_bot')
    console.log('=========================')
  }
}

const myBot = new TGBot()
myBot.start()
