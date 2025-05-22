import { Bot, Context } from 'grammy'
import dotenv from 'dotenv'
import UserSessionRepository from './src/repositories/UserSessionRepository'
import { createCommandHandlers } from './src/handlers/createCommandHandlers'
import { createStateHandlers } from './src/handlers/createStateHandlers'
import { ServiceConfig } from './src/config/serviceConfig'

dotenv.config()

class TGBot {
  private bot: Bot
  private services: ReturnType<typeof ServiceConfig.createServices>

  constructor() {
    const token = process.env.BOT_TOKEN

    if (!token) {
      throw new Error('BOT_TOKEN is not defined in environment variables.')
    }

    this.bot = new Bot(token)
    this.services = ServiceConfig.createServices(this.bot)
    ServiceConfig.subscribeTTLExpiration(this.services.userService)

    this.registerCommands()
    this.registerMessageHandler()

    const stateHandlers = createStateHandlers()
    this.services.stateSubscriber.registerHandlers(stateHandlers)

    this.bot.start()
    console.log('=========================')
    console.log('Bot is running:@Hacklancer_bot')
    console.log('=========================')
  }

  private registerCommands() {
    const handlers = createCommandHandlers()
    this.services.commandSubscriber.subscribe(handlers)
  }
  private registerMessageHandler() {
    this.bot.on('message', async (ctx: Context) => {
      await this.services.messageHandler.handle(ctx)
    })
  }
}

const myBot = new TGBot()
