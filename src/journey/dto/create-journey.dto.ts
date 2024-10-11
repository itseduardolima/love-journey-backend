import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJourneyDto {
  @ApiProperty({ description: 'Name of the first partner' })
  @IsString()
  @IsNotEmpty()
  partner1: string;

  @ApiProperty({ description: 'Name of the second partner' })
  @IsString()
  @IsNotEmpty()
  partner2: string;

  @ApiProperty({ description: 'Title of the love story' })
  @IsString()
  @IsNotEmpty()
  title: string;
}