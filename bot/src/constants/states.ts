export const STATES = {
  REGISTRATION: {
    WAITING_FOR_NAME: 'registration:waiting_for_name',
    AWAITING_CITY: 'registration:awaiting_city',
    AWAITNG_DESCRIPTION: 'registration:awaiting_description',
    AWAITING_PHOTO: 'registration:awaiting_photo',
    AWAITING_APPROVAL: 'registration:awaiting_approval'
    // Можно добавить другие состояния регистрации
  }
} as const
