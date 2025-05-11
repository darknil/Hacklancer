import { createClient, RedisClientType } from 'redis'

class RedisClient {
  private static instance: RedisClientType | null = null
  private static subscriberInstance: RedisClientType | null = null

  private constructor() {}

  // Основной клиент для выполнения команд Redis
  public static getInstance(): RedisClientType {
    if (!RedisClient.instance) {
      RedisClient.instance = createClient({
        url: `redis://${process.env.REDIS_HOST || 'localhost'}:${
          process.env.REDIS_PORT || 6379
        }`
      })

      RedisClient.instance.on('error', (err) => {
        console.error('Redis Client Error:', err)
      })

      RedisClient.instance
        .connect()
        .then(() => {
          console.log('Connected to Redis')
        })
        .catch((error) => {
          console.error('Error connecting to Redis:', error)
        })
    }

    return RedisClient.instance
  }

  // Клиент для подписки на события
  public static getSubscriberInstance(): RedisClientType {
    if (!RedisClient.subscriberInstance) {
      RedisClient.subscriberInstance = createClient({
        url: `redis://${process.env.REDIS_HOST || 'localhost'}:${
          process.env.REDIS_PORT || 6379
        }`
      })

      RedisClient.subscriberInstance.on('error', (err) => {
        console.error('Redis Subscriber Error:', err)
      })

      RedisClient.subscriberInstance
        .connect()
        .then(() => {
          console.log('Connected to Redis Subscriber')
        })
        .catch((error) => {
          console.error('Error connecting to Redis Subscriber:', error)
        })
    }

    return RedisClient.subscriberInstance
  }
}

export default RedisClient
