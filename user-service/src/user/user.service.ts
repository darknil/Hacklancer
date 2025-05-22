import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import {
  CreateUserDto,
  ResponseUserDto,
  UpdateUserDto,
} from '../dto/user.dtos';
import { STATES } from '../constants/states';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly httpService: HttpService,
  ) {}

  async getUserById(id: string): Promise<ResponseUserDto> {
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
        where: { chatId: createUserDto.chatId },
      });
      if (existedUser) {
        return existedUser;
      }
      createUserDto.state = STATES.REGISTRATION.WAITING_FOR_NAME;
      const user = this.userRepository.create(createUserDto);
      return this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Creating user error');
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    try {
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
