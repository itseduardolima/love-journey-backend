import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Journey } from './entities/journey.entity';
import { CreateJourneyDto } from './dto/create-journey.dto';

@Injectable()
export class JourneyService {
  constructor(
    @InjectRepository(Journey)
    private journeyRepository: Repository<Journey>,
  ) {}

  async create(createJourneyDto: CreateJourneyDto): Promise<Journey> {
    const journey = this.journeyRepository.create(createJourneyDto);
    return await this.journeyRepository.save(journey);
  }

  async findOne(id: string): Promise<Journey> {
    const journey = await this.journeyRepository.findOne({ 
      where: { id },
      relations: ['memories']
    });
    if (!journey) {
      throw new NotFoundException(`Journey with ID "${id}" not found`);
    }
    return journey;
  }
}