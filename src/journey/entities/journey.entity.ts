import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Memory } from '../../memories/entities/memory.entity';

@Entity('journey')
export class Journey {
  @ApiProperty({ description: 'Unique identifier for the journey' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the first partner' })
  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  partner1: string;

  @ApiProperty({ description: 'Name of the second partner' })
  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  partner2: string;

  @ApiProperty({ description: 'Title of the love story' })
  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  title: string;

  @ApiProperty({
    description: 'Memories associated with this journey',
    type: () => [Memory],
  })
  @OneToMany(() => Memory, (memory) => memory.journey)
  memories: Memory[];

  @ApiProperty({ description: 'Whether the journey is a paid version' })
  @Column({ name: 'is_paid', type: 'boolean', default: false })
  isPaid: boolean;

  @ApiProperty({ description: 'Expiration date of the journey' })
  @Column({ name: 'expiration_date', type: 'timestamp' })
  expirationDate: Date;

  @ApiProperty({ description: 'Date and time when the journey was created' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the journey was last updated' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}