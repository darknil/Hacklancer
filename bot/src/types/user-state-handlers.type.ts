import { UserStateHandler } from '../Interfaces/IUserStateHandler'
import { UserStateKey } from './user-state.type'

export type UserStateHandlers = Record<UserStateKey, UserStateHandler>
