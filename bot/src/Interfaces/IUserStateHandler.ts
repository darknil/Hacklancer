import { Context } from 'grammy'
import { UserStateKey } from '../types/UserState'

export interface UserStateHandler {
  handle(ctx: Context): Promise<void>
}
