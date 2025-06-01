import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('filter')
export class UserFilterEntity {
  @PrimaryColumn({ type: 'int' })
  chatId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  filter: string | null;
}
