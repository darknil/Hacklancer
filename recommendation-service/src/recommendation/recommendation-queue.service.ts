import { Injectable } from '@nestjs/common';
import { RecommendationQueue } from '../types/recommendation-cache.types';
import { RedisService } from '../redis/redis.service';
import { UserQueueService } from '../user-queue/user-queue.service';
import { UserApiService } from 'src/user-api/user-api.service';
import { UserFilterService } from 'src/user-filter/user-filter.service';
import { UserQueue } from 'src/types/userQueue';

@Injectable()
export class RecommendationQueueService {
  getRecommendationQueue(chatId: number) {
    throw new Error('Method not implemented.');
  }
  private readonly RECOMMENDATION_QUEUE_PREFIX = 'recommendation_queue:';
  private readonly CACHE_TTL = 600;
  private readonly CHUNK_SIZE = 10;
  constructor(
    private readonly redisService: RedisService,
    private readonly userQueueService: UserQueueService,
    private readonly userApiService: UserApiService,
    private readonly userFilterService: UserFilterService,
  ) {}

  async getNextRecommendations(userId: number): Promise<number[]> {
    const queueKey = `${this.RECOMMENDATION_QUEUE_PREFIX}`;
    const rawQueue = await this.redisService.get(queueKey);

    let usersId: number[];
    const parsed = rawQueue ? JSON.parse(rawQueue) : null;
    if (!rawQueue || parsed.usersId.length === 0) {
      try {
        usersId = await this.userApiService.getUsersId();
        await this.updateRecommendationQueue({ usersId });
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
      }
    } else {
      const recommendationQueue: RecommendationQueue = JSON.parse(rawQueue);
      usersId = recommendationQueue.usersId;
    }

    const userQueue = await this.userQueueService.getUserQueue(userId);
    const startIndex = this.getStartIndex(
      usersId,
      userQueue?.lastRecommendationId,
    );
    const chunk = this.getNextChunkCircular(usersId, startIndex, userId);

    await this.updateUserQueueState(userId, chunk, userQueue);

    return chunk;
  }

  async updateRecommendationQueue(queue: RecommendationQueue): Promise<void> {
    await this.redisService.set(
      `${this.RECOMMENDATION_QUEUE_PREFIX}`,
      JSON.stringify(queue),
      this.CACHE_TTL,
    );
  }
  async addUserToRecommendationQueue(userId: number): Promise<void> {
    const key = `${this.RECOMMENDATION_QUEUE_PREFIX}_list`;

    // Проверим, есть ли уже userId (через LRANGE)
    const existingIds = await this.redisService.lrange(key, 0, -1);

    if (existingIds.includes(userId.toString())) {
      return; // Не добавляем, если уже в очереди
    }

    // Добавим в начало
    await this.redisService.lpush(key, userId.toString());

    // Ограничим размер очереди (например, максимум 1000)
    await this.redisService.ltrim(key, 0, 999);

    // Установим TTL
    await this.redisService.expire(key, this.CACHE_TTL);
  }
  private getStartIndex(usersId: number[], lastId: number | null): number {
    if (lastId === null) return 0;
    const index = usersId.indexOf(lastId);
    return index >= 0 ? index + 1 : 0;
  }

  private async updateUserQueueState(
    userId: number,
    chunk: number[],
    userQueue: UserQueue | null,
  ): Promise<void> {
    const userFilter = await this.userFilterService.getUserFilter(userId);
    await this.userQueueService.updateUserQueue(userId, {
      userFilter,
      lastRecommendationId: chunk.at(-1) ?? null,
      ...(userQueue || {}),
    });
  }

  private getNextChunkCircular(
    usersId: number[],
    startIndex: number,
    selfId?: number,
  ): number[] {
    console.log('self id', selfId);
    console.log('typee of selfId', typeof selfId);
    const filteredUsers = usersId.filter((id) => id !== selfId);

    if (filteredUsers.length <= this.CHUNK_SIZE) {
      const clearedChunk = filteredUsers.filter((id) => id !== selfId);
      console.log('cleared chunk', clearedChunk);
      return filteredUsers;
    }

    const chunk: number[] = [];
    let i = 0;

    while (chunk.length < this.CHUNK_SIZE) {
      const index = (startIndex + i) % filteredUsers.length;
      chunk.push(filteredUsers[index]);
      i++;
    }

    const clearedChunk = chunk.filter((id) => id !== selfId);
    console.log('cleared chunk', clearedChunk);
    return filteredUsers;
  }
}
