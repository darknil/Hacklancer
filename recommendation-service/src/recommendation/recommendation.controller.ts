import { Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { RecommendationQueueService } from './recommendation-queue.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(readonly recommendationService: RecommendationQueueService) {}

  @Get('next')
  async getNextRecommendations(@Query('chatId', ParseIntPipe) chatId: number) {
    return await this.recommendationService.getNextRecommendations(chatId);
  }
  @Post('user')
  async addUserToQueue(@Query('chatId', ParseIntPipe) chatId: number) {
    return this.recommendationService.addUserToRecommendationQueue(chatId);
  }
}
