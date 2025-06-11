import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateHackathonDto } from './dto/hackathon.dto';
import { HackathonService } from './hackathon.service';

@Controller('hackathons')
export class HackathonController {
  constructor(private readonly hackathonService: HackathonService) {}
  @Get()
  async getActiveHackathons() {
    return 'All hackathons';
  }

  @Get(':id')
  async getHackathonById(@Query() id: string) {
    return 'Hackathon by id';
  }
  @Post()
  async createHackathon(@Body() createHackathonDto: CreateHackathonDto) {
    await this.hackathonService.create(createHackathonDto);
  }
}
