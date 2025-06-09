import { ICallBackQueryHandler } from '../Interfaces/ICallBackQueryHandler'

export type BotQueryHandlers = {
  response: ICallBackQueryHandler
  ignore: ICallBackQueryHandler
}
