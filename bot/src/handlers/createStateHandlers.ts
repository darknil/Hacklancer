import { UserStateHandlers } from '../types/UserStateHandlers'
import { AwaitingNameState } from './state/registration/awaitingName'
import { STATES } from '../constants/states'

export const createStateHandlers = (): UserStateHandlers => ({
  [STATES.REGISTRATION.WAITING_FOR_NAME]: new AwaitingNameState()
})
