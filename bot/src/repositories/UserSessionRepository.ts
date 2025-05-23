import RedisClient from '../redis/RedisClient'
import { UserData } from '../types/UserData'

class UserSessionRepository {
  // ===== USER & SESSION METHODS =====

  static async saveUserSession(
    userId: string,
    data: UserData,
    ttlSeconds: number
  ) {
    const redis = RedisClient.getInstance()
    console.log('Saving user session for', userId, 'with TTL', ttlSeconds)
    await redis.set(`user_session:${userId}`, JSON.stringify(data), {
      EX: ttlSeconds
    })
    await redis.set(`user_session_backup:${userId}`, JSON.stringify(data), {
      EX: ttlSeconds + 5
    })
  }

  static async getUserSession(userId: string): Promise<UserData | null> {
    const redis = RedisClient.getInstance()
    const raw = await redis.get(`user_session:${userId}`)
    return raw ? JSON.parse(raw) : null
  }

  static async deleteUserSession(userId: string) {
    const redis = RedisClient.getInstance()
    await redis.del(`user_session:${userId}`)
    console.log(`User and Session for ${userId} deleted.`)
  }

  static subscribeToSessionExpiration(
    callback: (userId: string, sessionData?: UserData) => void
  ) {
    const subscriber = RedisClient.getSubscriberInstance()

    subscriber.pSubscribe('__keyevent@0__:expired', async (message) => {
      if (message.startsWith('user_session:')) {
        const userId = message.replace('user_session:', '')

        const backupData = await RedisClient.getInstance().get(
          `user_session_backup:${userId}`
        )
        const parsedData = backupData ? JSON.parse(backupData) : undefined

        callback(userId, parsedData)
      }
    })

    console.log('Subscribed to user session expiration events.')
  }
}

export default UserSessionRepository
