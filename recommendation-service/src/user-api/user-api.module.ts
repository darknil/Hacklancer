import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserApiService } from './user-api.service';

@Module({
  imports: [HttpModule], // ✅ добавьте это
  providers: [UserApiService],
  exports: [UserApiService],
})
export class UserApiModule {}
