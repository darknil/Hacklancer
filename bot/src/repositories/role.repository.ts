import RedisClient from '../redis/redis-client'
import { RoleData } from '../types/role-data.type'

export class RoleRepository {
  private readonly ROLE_PREFIX = 'role:'
  private readonly DEFAULT_TTL = 3600 // 1 час в секундах

  async get(roleUuid: string): Promise<RoleData | null> {
    const redis = RedisClient.getInstance()
    const roleData = await redis.get(`${this.ROLE_PREFIX}${roleUuid}`)
    return roleData ? JSON.parse(roleData) : null
  }

  async save(
    roleUuid: string,
    data: RoleData,
    ttlSeconds = this.DEFAULT_TTL
  ): Promise<void> {
    const redis = RedisClient.getInstance()
    await redis.setEx(
      `${this.ROLE_PREFIX}${roleUuid}`,
      ttlSeconds,
      JSON.stringify(data)
    )
  }

  async getAllRoles(): Promise<RoleData[]> {
    const redis = RedisClient.getInstance()
    const keys = await redis.keys(`${this.ROLE_PREFIX}*`)
    const roles: RoleData[] = []

    for (const key of keys) {
      const roleData = await redis.get(key)
      if (roleData) {
        roles.push(JSON.parse(roleData))
      }
    }

    return roles
  }
}
