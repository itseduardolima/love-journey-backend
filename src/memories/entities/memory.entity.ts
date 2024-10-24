import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Journey } from '../../journey/entities/journey.entity';

@Entity("memory")
export class Memory {
  @ApiProperty({ description: 'Unique identifier for the memory' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Date of the memory' })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ description: 'Title of the memory' })
  @Column({ type: 'varchar', length: 255, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  title: string;

  @ApiProperty({ description: 'Description of the memory' })
  @Column({ type: 'text', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  description: string;

  @ApiProperty({ description: 'Photo of the memory' })
  @Column({ type: 'longblob', nullable: true })
  photo: Buffer;

  @ApiProperty({ description: 'MIME type of the photo' })
  @Column({ name: 'photo_mime_type', nullable: true })
  photoMimeType: string;

  @ManyToOne(() => Journey, journey => journey.memories)
  journey: Journey;
}