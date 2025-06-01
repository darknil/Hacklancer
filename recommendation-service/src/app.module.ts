import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { DbModule } from './db/db.module';
import { HealthModule } from './health/health.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { RecommendationModule } from './recommendation/recommendation.module';
import { UserFilterModule } from './user-filter/user-filter.module';
import { UserApiModule } from './user-api/user-api.module';
import { UserQueueService } from './user-queue/user-queue.service';
import { RecommendationQueueService } from './recommendation/recommendation-queue.service';
import { UserQueueModule } from './user-queue/user-queue.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RedisModule,
    DbModule,
    HealthModule,
    RecommendationModule,
    UserFilterModule,
    UserApiModule,
    UserQueueModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserQueueService, RecommendationQueueService],
})
export class AppModule {}
