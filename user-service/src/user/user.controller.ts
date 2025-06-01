import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  GetUsersByIdsDto,
  UpdateUserDto,
} from '../dto/user.dtos';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('recent-ids')
  async getUsers() {
    return this.userService.getRecentUsers();
  }
  @Post('ids')
  async getUsersById(@Body('Ids') ids: GetUsersByIdsDto) {
    return this.userService.getUsersById(ids.Ids);
  }
  @Get()
  async getUser(@Query('chatId') chatId: number) {
    return this.userService.getUserById(chatId);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log('createUserDto: ', createUserDto);
    return this.userService.createUser(createUserDto);
  }

  @Put()
  async updateUser(
    @Query('chatId', ParseIntPipe) chatId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log('updateUserDto: ', updateUserDto);
    return this.userService.updateUser(chatId, updateUserDto);
  }
}
