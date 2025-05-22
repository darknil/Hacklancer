import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule } from './role/role.module';
import { DbModule } from './db/db.module';
import { RoleImportModule } from './role-import/role-import.module';

@Module({
  imports: [RoleModule, DbModule, RoleImportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
