import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hackathon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  FormatType: string;

  @Column({ type: 'varchar', nullable: true })
  prizeCurrency: string | null;

  @Column({ type: 'bigint', nullable: true })
  prizeAmount: string | null;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'varchar', array: true })
  topics: string[];
}
