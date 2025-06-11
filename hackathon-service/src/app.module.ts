import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HackathonModule } from './hackathon/hackathon.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [HackathonModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
