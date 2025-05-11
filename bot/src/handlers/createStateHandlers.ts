import { UserStateHandlers } from '../types/UserStateHandlers'
import { EnterNameState } from './state/registration/enterName'

export const createStateHandlers = (): UserStateHandlers => ({
  'registration:waiting_for_name': new EnterNameState()
})
