import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { MessageBrokerModule } from 'src/message-broker/message-broker.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    HttpModule,
    MessageBrokerModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
