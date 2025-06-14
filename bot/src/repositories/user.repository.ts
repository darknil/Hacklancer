import UserSessionRepository from './user-session.repository'
import { UserData } from '../types/user-data.type'
import { UserState, UserStateKey } from '../types/user-state.type'
import dotenv from 'dotenv'
dotenv.config()

export class UserRepository {
  SESSION_TTL: number
  constructor() {
    this.SESSION_TTL = parseInt(process.env.SESSION_TTL || '60')
  }
  async get(userId: string | number): Promise<UserData | null> {
    const userIdString = userId.toString()
    return await UserSessionRepository.getUserSession(userIdString)
  }

  async save(
    userId: string | number,
    data: UserData,
    ttlSeconds = this.SESSION_TTL
  ): Promise<void> {
    const userIdString = userId.toString()
    await UserSessionRepository.saveUserSession(userIdString, data, ttlSeconds)
  }
  async update(
    userId: string | number,
    update: Partial<UserData>
  ): Promise<void> {
    const userIdString = userId.toString()
    const current = await this.get(userIdString)
    if (!current) {
      console.warn(`No session found for user ${userId}`)
      return
    }

    const merged = { ...current, ...update }
    await this.save(userIdString, merged)
  }

  async getState(userId: string | number): Promise<UserState | undefined> {
    const userIdString = userId.toString()
    const data = await this.get(userIdString)
    if (!data?.state) return undefined

    const [group, value] = data.state.split(':')
    return {
      group: group as UserState['group'],
      value: value as UserState['value']
    }
  }

  async setState(userId: string | number, state: UserStateKey): Promise<void> {
    const userIdString = userId.toString()
    const currentData = await this.get(userIdString)
    await this.update(userIdString, {
      ...currentData,
      state
    })
  }

  async clearState(
    userId: string,
    ttlSeconds = this.SESSION_TTL
  ): Promise<void> {
    const data = await this.get(userId)
    if (!data) return

    delete data.state
    await this.save(userId, data, ttlSeconds)
  }
}
