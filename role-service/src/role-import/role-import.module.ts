import { Module } from '@nestjs/common';
import { RoleImportService } from './role-import.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [RoleModule],
  providers: [RoleImportService],
  exports: [RoleImportService],
})
export class RoleImportModule {}
