import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Journey } from '../../journey/entities/journey.entity';

@Entity()
export class Memory {
  @ApiProperty({ description: 'Unique identifier for the memory' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Date of the memory' })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ description: 'Title of the memory' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Description of the memory' })
  @Column()
  description: string;

  @ApiProperty({ description: 'URL of the photo' })
  @Column()
  photo: string;

  @ManyToOne(() => Journey, journey => journey.memories)
  journey: Journey;
}