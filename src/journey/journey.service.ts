import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Journey } from './entities/journey.entity';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class JourneyService {
  constructor(
    @InjectRepository(Journey)
    private journeyRepository: Repository<Journey>,
  ) {}

  async create(createJourneyDto: CreateJourneyDto): Promise<Journey> {
    const journey = this.journeyRepository.create(createJourneyDto);

    const now = new Date();
    if (journey.isPaid) {
      journey.expirationDate = new Date(now.setMonth(now.getMonth() + 1));
    } else {
      journey.expirationDate = new Date(now.setDate(now.getDate() + 1));
    }

    return await this.journeyRepository.save(journey);
  }

  async findOne(id: string): Promise<Journey> {
    const journey = await this.journeyRepository.findOne({
      where: { id },
      relations: ['memories'],
    });
    if (!journey) {
      throw new NotFoundException(`Journey with ID "${id}" not found`);
    }
    return journey;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeExpiredJourneys() {
    const now = new Date();
    await this.journeyRepository.delete({
      expirationDate: LessThan(now),
    });
  }
}
