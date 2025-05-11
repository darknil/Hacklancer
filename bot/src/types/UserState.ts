export type UserState = {
  group: 'registration'
  value: 'waiting_for_name'
}

export type UserStateKey = `${UserState['group']}:${UserState['value']}`
