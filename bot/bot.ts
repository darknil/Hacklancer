import { Bot, Context } from 'grammy'
import dotenv from 'dotenv'
import { CommandHandlerFactory } from './src/handlers/create-command-handlers'
import { StateHandlerFactory } from './src/handlers/create-state-handlers'
import { ServiceConfig } from './src/config/service-сonfig'
import { commands } from './src/constants/commands'
import { QueryHandlerFactory } from './src/handlers/create-query-handlers'

dotenv.config()

class TGBot {
  private bot: Bot
  private services: ReturnType<typeof ServiceConfig.createServices>
  private CommandHandlerFactory: CommandHandlerFactory
  private StateHandlerFactory: StateHandlerFactory
  private QueryHandleFactory: QueryHandlerFactory

  constructor() {
    const token = process.env.BOT_TOKEN

    if (!token) {
      throw new Error('BOT_TOKEN is not defined in environment variables.')
    }

    this.bot = new Bot(token)
    this.CommandHandlerFactory = new CommandHandlerFactory()
    this.StateHandlerFactory = new StateHandlerFactory()
    this.QueryHandleFactory = new QueryHandlerFactory()
    this.services = ServiceConfig.createServices(this.bot)
    ServiceConfig.subscribeTTLExpiration(this.services.userService)

    this.registerCommands()
    this.registerMessageHandler()
    this.registerPollHandler()
    this.registerCallbackQueryHandler()

    this.bot.start()
    console.log('=========================')
    console.log('Bot is running:@Hacklancer_bot')
    console.log('=========================')
  }

  private registerCommands() {
    this.bot.api.setMyCommands(commands)

    const commandhandlers = this.CommandHandlerFactory.createCommandHandlers()
    this.services.commandSubscriber.subscribe(commandhandlers)
  }
  private registerMessageHandler() {
    const stateHandlers = this.StateHandlerFactory.createStateHandlers()
    this.services.stateSubscriber.registerHandlers(stateHandlers)

    this.bot.on('message', async (ctx: Context) => {
      await this.services.messageHandler.handle(ctx)
    })
  }
  private registerPollHandler() {
    this.bot.on('poll_answer', async (ctx: Context) => {
      await this.services.pollHandler.handle(ctx)
    })
  }
  private registerCallbackQueryHandler() {
    const callbackQueryHandlers = this.QueryHandleFactory.createQueryHandlers()
    this.services.querySubscriber.registerHandlers(callbackQueryHandlers)
    this.bot.on('callback_query', async (ctx: Context) => {
      await this.services.queryHandler.handle(ctx)
    })
  }
}

const myBot = new TGBot()
