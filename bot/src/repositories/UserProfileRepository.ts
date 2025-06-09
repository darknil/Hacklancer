import RedisClient from '../redis/RedisClient'
import { ProfileData } from '../types/ProfileData'

export class UserProfileRepository {
  private readonly ROLE_PREFIX = 'profile:'
  private readonly DEFAULT_TTL = 300
  async get(chatId: number): Promise<ProfileData | null> {
    const redis = RedisClient.getInstance()
    const userData = await redis.get(`${this.ROLE_PREFIX}${chatId}`)
    return userData ? JSON.parse(userData) : null
  }
  async save(
    chatId: number,
    data: ProfileData,
    ttlSeconds = this.DEFAULT_TTL
  ): Promise<void> {
    const redis = RedisClient.getInstance()
    await redis.setEx(
      `${this.ROLE_PREFIX}${chatId}`,
      ttlSeconds,
      JSON.stringify(data)
    )
  }
  async delete(chatId: number): Promise<void> {
    const redis = RedisClient.getInstance()
    await redis.del(`${this.ROLE_PREFIX}${chatId}`)
  }
}
