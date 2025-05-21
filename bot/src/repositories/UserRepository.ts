import UserSessionRepository from './UserSessionRepository'
import { UserData } from '../types/UserData'
import { UserState, UserStateKey } from '../types/UserState'
import dotenv from 'dotenv'
dotenv.config()

export class UserRepository {
  SESSION_TTL: number
  constructor() {
    this.SESSION_TTL = parseInt(process.env.SESSION_TTL || '60')
  }
  async get(userId: string): Promise<UserData | null> {
    return await UserSessionRepository.getUserSession(userId)
  }

  async save(userId: string, data: UserData, ttlSeconds = 300): Promise<void> {
    await UserSessionRepository.saveUserSession(userId, data, ttlSeconds)
  }
  async update(userId: string, update: Partial<UserData>): Promise<void> {
    const current = await this.get(userId)
    if (!current) {
      console.warn(`No session found for user ${userId}`)
      return
    }

    const merged = { ...current, ...update }
    await this.save(userId, merged)
  }

  async getState(userId: string): Promise<UserState | undefined> {
    const data = await this.get(userId)
    if (!data?.state) return undefined

    const [group, value] = data.state.split(':')
    return {
      group: group as UserState['group'],
      value: value as UserState['value']
    }
  }

  async setState(userId: string, state: UserStateKey): Promise<void> {
    await this.update(userId, { state })
  }

  async clearState(userId: string, ttlSeconds = 300): Promise<void> {
    const data = await this.get(userId)
    if (!data) return

    delete data.state
    await this.save(userId, data, ttlSeconds)
  }
}
