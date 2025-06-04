import { forwardRef, Module } from '@nestjs/common';
import { UserQueueService } from './user-queue.service';
import { RedisModule } from '../redis/redis.module';
import { UserFilterModule } from '../user-filter/user-filter.module';

@Module({
  imports: [RedisModule, forwardRef(() => UserFilterModule)],
  providers: [UserQueueService],
  exports: [UserQueueService],
})
export class UserQueueModule {}
