import { UserStateHandler } from '../Interfaces/IUserStateHandler'
import { UserStateKey } from './UserState'

export type UserStateHandlers = Record<UserStateKey, UserStateHandler>
