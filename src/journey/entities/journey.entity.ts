import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Memory } from '../../memories/entities/memory.entity';

@Entity('journey')
export class Journey {
  @ApiProperty({ description: 'Unique identifier for the journey' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the first partner' })
  @Column()
  partner1: string;

  @ApiProperty({ description: 'Name of the second partner' })
  @Column()
  partner2: string;

  @ApiProperty({ description: 'Title of the love story' })
  @Column()
  title: string;

  @OneToMany(() => Memory, memory => memory.journey)
  memories: Memory[];
}