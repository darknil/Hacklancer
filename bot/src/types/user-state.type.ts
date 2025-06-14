export type UserState = {
  group: string
  value: string
}

export type UserStateKey = `${UserState['group']}:${UserState['value']}`
