import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { UserQueue } from '../types/user-queue';
import { UserFilterService } from '../user-filter/user-filter.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserQueueService {
  private readonly USER_QUEUE_PREFIX = 'user_queue:';
  private readonly CACHE_TTL = 3600;

  constructor(
    private readonly redisService: RedisService,
    private readonly userFilterService: UserFilterService,
  ) {}

  async getUserQueue(chatId: number): Promise<UserQueue> {
    const cachedQueue = await this.redisService.get(
      `${this.USER_QUEUE_PREFIX}${chatId}`,
    );

    if (cachedQueue) {
      return JSON.parse(cachedQueue);
    }

    // Вместо прямого обращения к репозиторию — обращаемся к UserFilterService
    let filter = await this.userFilterService.getUserFilter(chatId);

    // Если фильтра нет, создаём пустой и сохраняем через сервис
    if (filter === null) {
      await this.userFilterService.setUserFilter(chatId, '');
      filter = '';
    }

    const newQueue: UserQueue = {
      userFilter: filter,
      lastRecommendationId: null,
    };

    await this.updateUserQueue(chatId, newQueue);

    return newQueue;
  }

  async updateUserQueue(chatId: number, queue: UserQueue): Promise<void> {
    await this.redisService.set(
      `${this.USER_QUEUE_PREFIX}${chatId}`,
      JSON.stringify(queue),
      this.CACHE_TTL,
    );
  }
  @OnEvent('userFilterUpdated')
  async handleUserFilterUpdated(payload: { chatId: number; filter: string }) {
    const userQueue = await this.getUserQueue(payload.chatId);
    await this.updateUserQueue(payload.chatId, {
      userFilter: payload.filter,
      lastRecommendationId: userQueue.lastRecommendationId,
    });
  }
}
