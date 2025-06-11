import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll() {
    return this.roleService.findAll();
  }
  @Get('one')
  findOne(@Query('uuid') uuid: string) {
    console.log(`[${new Date().toISOString()}] get role by id: ${uuid}`);
    return this.roleService.findOne(uuid);
  }
}
