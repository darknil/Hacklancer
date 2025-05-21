import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ type: 'bigint' })
  chatId: number;

  @Column({ type: 'varchar', nullable: true })
  username?: string;

  @Column({ type: 'varchar', nullable: true })
  nickname?: string;

  @Column({ type: 'varchar', nullable: true })
  first_name?: string;

  @Column({ type: 'varchar', nullable: true })
  last_name?: string;

  @Column({ type: 'varchar', nullable: true })
  state?: string; // если UserStateKey — enum, можно использовать enum-поле

  @Column({ type: 'varchar', nullable: true })
  language_code?: string;
}
