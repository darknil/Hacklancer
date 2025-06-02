import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { HealthModule } from './health/health.module';
import { MessageBrokerModule } from './message-broker/message-broker.module';

@Module({
  imports: [UserModule, DbModule, HealthModule, MessageBrokerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
