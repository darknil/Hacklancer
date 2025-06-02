export const STATES = {
  REGISTRATION: {
    AWAITING_NAME: 'registration:waiting_for_name',
    AWAITING_CITY: 'registration:awaiting_city',
    AWAITING_DESCRIPTION: 'registration:awaiting_description',
    AWAITING_PHOTO: 'registration:awaiting_photo',
    AWAITING_ROLES: 'registration:awaiting_roles',
    AWAITING_APPROVAL: 'registration:awaiting_approval'
  },
  MAIN: {
    AWAITING_ACTION: 'main:awaiting_action'
  },
  PROFILE: {
    AWAITING_ACTION: 'profile:awaiting_action',
    EDIT_DESCRIPTION: 'profile:edit_description',
    EDIT_PHOTO: 'profile:edit_photo'
  },
  MATCHING: {}
} as const
