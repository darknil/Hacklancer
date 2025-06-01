import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { UserFilterService } from './user-filter.service';

@Controller('filter')
export class UserFilterController {
  constructor(readonly userFilterService: UserFilterService) {}

  @Post('update')
  async updateUserFilter(
    @Query('chatId') chatId: number,
    @Body('filter') filter: string,
  ): Promise<void> {
    const currentFilter = await this.userFilterService.getUserFilter(chatId);
    if (!currentFilter) {
      await this.userFilterService.setUserFilter(chatId, filter);
      return;
    }
    await this.userFilterService.updateUserFilter(chatId, filter);
  }
}
