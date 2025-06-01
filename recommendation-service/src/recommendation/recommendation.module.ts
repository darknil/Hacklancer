import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { UserFilterModule } from '../user-filter/user-filter.module';
import { RecommendationQueueService } from './recommendation-queue.service';
import { RedisModule } from '../redis/redis.module';
import { UserQueueModule } from '../user-queue/user-queue.module';
import { UserApiModule } from '../user-api/user-api.module';

@Module({
  imports: [UserFilterModule, RedisModule, UserQueueModule, UserApiModule],
  controllers: [RecommendationController],
  providers: [RecommendationQueueService],
})
export class RecommendationModule {}
