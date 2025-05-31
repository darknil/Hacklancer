// role.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { In } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(name: string): Promise<Role> {
    const existing = await this.roleRepository.findOne({ where: { name } });
    if (existing) return existing;

    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }
  async findOne(id: string): Promise<Role> {
    // TODO: FIX ME
    return this.roleRepository.findOne({ where: { id } });
  }
}
