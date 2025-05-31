import { BotCommandHandlers } from '../types/BotCommandHandlers'
import { StartCommand } from './commands/StartCommand'

export const createCommandHandlers = (): BotCommandHandlers => ({
  start: new StartCommand()
})
