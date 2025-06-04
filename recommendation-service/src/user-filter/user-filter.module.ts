import { forwardRef, Module } from '@nestjs/common';
import { RecommendationModule } from '../recommendation/recommendation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFilterEntity } from './entity/user-filter.entity';
import { UserFilterController } from './user-filter.controller';
import { UserFilterService } from './user-filter.service';
import { UserQueueModule } from 'src/user-queue/user-queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserFilterEntity]),
    forwardRef(() => UserQueueModule),
  ],
  controllers: [UserFilterController],
  providers: [UserFilterService],
  exports: [UserFilterService],
})
export class UserFilterModule {}
