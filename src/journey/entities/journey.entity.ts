import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Memory } from '../../memories/entities/memory.entity';

@Entity('journey')
export class Journey {
  @ApiProperty({ description: 'Unique identifier for the journey' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the first partner' })
  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  partner1: string;

  @ApiProperty({ description: 'Name of the second partner' })
  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  partner2: string;

  @ApiProperty({ description: 'Title of the love story' })
  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  title: string;

  @OneToMany(() => Memory, memory => memory.journey)
  memories: Memory[];
}