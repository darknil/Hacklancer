import RedisClient from '../redis/RedisClient'
import { UserData } from '../types/UserData'

class UserSessionRepository {
  // ===== USER & SESSION METHODS =====

  static async saveUserSession(
    userId: string,
    data: UserData,
    ttlSeconds: number
  ) {
    const redis = RedisClient.getInstance() // Основной клиент для выполнения команд

    // Сохраняем данные пользователя и сессии в одном ключе
    await redis.set(`user_session:${userId}`, JSON.stringify(data), {
      EX: ttlSeconds
    })
  }

  static async getUserSession(userId: string): Promise<UserData | null> {
    const redis = RedisClient.getInstance() // Основной клиент для выполнения команд
    const raw = await redis.get(`user_session:${userId}`)
    return raw ? JSON.parse(raw) : null
  }

  static async deleteUserSession(userId: string) {
    const redis = RedisClient.getInstance() // Основной клиент для выполнения команд
    await redis.del(`user_session:${userId}`)
    console.log(`User and Session for ${userId} deleted.`)
  }

  static subscribeToSessionExpiration(callback: (userId: string) => void) {
    const subscriber = RedisClient.getSubscriberInstance() // Клиент для подписки

    subscriber.pSubscribe('__keyevent@0__:expired', (message) => {
      if (message.startsWith('user_session:')) {
        callback(message.replace('user_session:', ''))
      }
    })

    console.log('Subscribed to user session expiration events.')
  }
}

export default UserSessionRepository
