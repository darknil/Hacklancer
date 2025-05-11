import { UserStateKey } from './UserState'

export type UserData = {
  username?: string
  first_name?: string
  last_name?: string
  state?: UserStateKey
  language_code?: string
}
