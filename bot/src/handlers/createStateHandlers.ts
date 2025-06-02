import { UserStateHandlers } from '../types/UserStateHandlers'
import { AwaitingNameState } from './state/registration/awaitingName'
import { STATES } from '../constants/states'
import { AwaitingCityState } from './state/registration/AwaitingCity'
import { AwaitingDescriptionState } from './state/registration/AwaitingDescription'
import { AwaitingRolesState } from './state/registration/AwaitingRoles'
import { AwaitingPhotoState } from './state/registration/AwaitingPhoto'
import { AwaitingAprovalState } from './state/registration/AwaitingAproval'
import { MainAwaitingActionState } from './state/main/AwaitingAction'

export const createStateHandlers = (): UserStateHandlers => ({
  [STATES.REGISTRATION.AWAITING_NAME]: new AwaitingNameState(),
  [STATES.REGISTRATION.AWAITING_CITY]: new AwaitingCityState(),
  [STATES.REGISTRATION.AWAITING_ROLES]: new AwaitingRolesState(),
  [STATES.REGISTRATION.AWAITING_DESCRIPTION]: new AwaitingDescriptionState(),
  [STATES.REGISTRATION.AWAITING_PHOTO]: new AwaitingPhotoState(),
  [STATES.REGISTRATION.AWAITING_APPROVAL]: new AwaitingAprovalState(),
  [STATES.MAIN.AWAITING_ACTION]: new MainAwaitingActionState()
})
