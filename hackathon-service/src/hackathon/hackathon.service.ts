import { Injectable } from '@nestjs/common';
import { CreateHackathonDto } from './dto/hackathon.dto';

@Injectable()
export class HackathonService {
  async create(hackathon: CreateHackathonDto) {}
  async getAll() {}
  async getById() {}
  async update() {}
}
