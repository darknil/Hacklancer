import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFilterEntity } from './entity/user-filter.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserFilterService {
  constructor(
    @InjectRepository(UserFilterEntity)
    private userFilterRepository: Repository<UserFilterEntity>,
    private eventEmitter: EventEmitter2,
  ) {}
  async getUserFilter(chatId: number): Promise<string | null> {
    const user = await this.userFilterRepository.findOne({ where: { chatId } });
    return user?.filter || null;
  }
  async setUserFilter(chatId: number, filter: string | null): Promise<void> {
    await this.userFilterRepository.save({ chatId: Number(chatId), filter });
  }
  async updateUserFilter(chatId: number, filter: string): Promise<void> {
    await this.userFilterRepository.update({ chatId }, { filter });
    this.eventEmitter.emit('userFilterUpdated', { chatId, filter });
  }
}
