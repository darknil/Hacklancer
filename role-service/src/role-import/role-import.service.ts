// role-import.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { RoleService } from '../role/role.service';
import { roles } from 'src/data/roles';
@Injectable()
export class RoleImportService implements OnModuleInit {
  roles: string[];
  constructor(private readonly roleService: RoleService) {
    this.roles = roles;
  }

  async onModuleInit() {
    console.log('[RoleImportService] Проверка и импорт ролей...');
    for (const roleName of this.roles) {
      await this.roleService.createRole(roleName);
    }
    console.log('[RoleImportService] Роли импортированы.');
  }

  // async importFromCsv(filePath: string): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     fs.createReadStream(filePath)
  //       .pipe(csvParser())
  //       .on('data', async (row) => {
  //         if (row.name) {
  //           await this.roleService.createRole(row.name.trim());
  //         }
  //       })
  //       .on('end', () => {
  //         console.log('[RoleImportService] Импорт завершён.');
  //         resolve();
  //       })
  //       .on('error', (err) => {
  //         console.error('[RoleImportService] Ошибка при импорте:', err);
  //         reject(err);
  //       });
  //   });
  // }
}
