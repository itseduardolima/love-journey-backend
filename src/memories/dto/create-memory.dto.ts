import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'src/common/validators/is-date-string-validator';

export class CreateMemoryDto {
  @ApiProperty({ description: 'Date of the memory', example: '20/01/2024' })
  @IsDateString('DD/MM/YYYY', { message: 'date must be a valid date string in the format DD/MM/YYYY' })
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'Title of the memory' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the memory' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'ID of the associated journey' })
  @IsUUID()
  @IsNotEmpty()
  journeyId: string;
}