import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import {
  CreateUserDto,
  ResponseUserDto,
  UpdateUserDto,
} from '../dto/user.dtos';
import { STATES } from '../constants/states';
import { HttpService } from '@nestjs/axios';
import { MessageBrokerService } from 'src/message-broker/message-broker.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly httpService: HttpService,
    private readonly broker: MessageBrokerService,
  ) {}

  async getRecentUsers(): Promise<number[]> {
    const users = await this.userRepository.find({
      where: {
        photoURL: Not(IsNull()),
      },
      order: {
        updatedAt: 'DESC',
      },
    });
    return users.map((user) => user.chatId);
  }
  async getUsersById(chatIds: number[]): Promise<UserEntity[] | null> {
    return this.userRepository.find({ where: { chatId: In(chatIds) } });
  }
  async getUserById(id: number): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({
      where: { chatId: Number(id) },
    });

    if (!user) {
      throw new NotFoundException(`User with chatId=${id} not found`);
    }

    return new ResponseUserDto({ ...user });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const existedUser = await this.userRepository.findOne({
        where: { chatId: Number(createUserDto.chatId) },
      });
      if (existedUser) {
        return existedUser;
      }
      createUserDto.state = STATES.REGISTRATION.WAITING_FOR_NAME;
      const user = this.userRepository.create(createUserDto);
      this.broker.emit('user.created', { userId: createUserDto.chatId });
      return this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Creating user error');
    }
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    try {
      console.log('user id : ', id);
      console.log('updateUserDto : ', updateUserDto);
      const user = await this.getUserById(id);
      const updated = Object.assign(user, updateUserDto);
      return await this.userRepository.save(updated);
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw new InternalServerErrorException(
        `Failed to update user with id ${id}`,
      );
    }
  }
}
