export const STATES = {
  REGISTRATION: {
    AWAITING_NAME: 'registration:waiting_for_name',
    AWAITING_CITY: 'registration:awaiting_city',
    AWAITING_DESCRIPTION: 'registration:awaiting_description',
    AWAITING_PHOTO: 'registration:awaiting_photo',
    AWAITING_APPROVAL: 'registration:awaiting_approval',
    AWAITING_ROLES: 'registration:awaiting_roles'
    // Можно добавить другие состояния регистрации
  },
  Home: {},
  Profile: {}
} as const
