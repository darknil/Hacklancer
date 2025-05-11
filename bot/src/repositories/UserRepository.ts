import UserSessionRepository from './UserSessionRepository'
import { UserData } from '../types/UserData'
import { UserState, UserStateKey } from '../types/UserState'
import dotenv from 'dotenv'
dotenv.config()
class UserRepository {
  static SESSION_TTL: number = parseInt(process.env.SESSION_TTL || '60')
  static async get(userId: string): Promise<UserData | null> {
    return await UserSessionRepository.getUserSession(userId)
  }

  static async save(
    userId: string,
    data: UserData,
    ttlSeconds = 300
  ): Promise<void> {
    await UserSessionRepository.saveUserSession(userId, data, this.SESSION_TTL)
  }
  static async update(
    userId: string,
    update: Partial<UserData>
  ): Promise<void> {
    const current = await this.get(userId)
    if (!current) {
      console.warn(`No session found for user ${userId}`)
      return
    }

    const merged = { ...current, ...update }
    await this.save(userId, merged, this.SESSION_TTL)
  }

  static async getState(userId: string): Promise<UserState | undefined> {
    const data = await this.get(userId)
    if (!data?.state) return undefined

    const [group, value] = data.state.split(':')
    return {
      group: group as UserState['group'],
      value: value as UserState['value']
    }
  }

  static async setState(userId: string, state: UserState): Promise<void> {
    const key: UserStateKey = `${state.group}:${state.value}`
    await this.update(userId, { state: key })
  }

  static async clearState(userId: string, ttlSeconds = 300): Promise<void> {
    const data = await this.get(userId)
    if (!data) return

    delete data.state
    await this.save(userId, data, ttlSeconds)
  }

  static async findOrCreate(
    userId: string,
    Data?: UserData
  ): Promise<UserData> {
    let userData = await this.get(userId)

    if (!userData) {
      userData = {
        username: Data?.username || '',
        first_name: Data?.first_name || '',
        last_name: Data?.last_name || '',
        language_code: Data?.language_code || '',
        state: 'registration:waiting_for_name'
      }

      await this.save(userId, userData)
    }

    return userData
  }
}

export default UserRepository
