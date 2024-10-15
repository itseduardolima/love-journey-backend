import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memory } from './entities/memory.entity';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { Journey } from '../journey/entities/journey.entity';
import * as moment from 'moment';

@Injectable()
export class MemoriesService {
  constructor(
    @InjectRepository(Memory)
    private memoriesRepository: Repository<Memory>,
    @InjectRepository(Journey)
    private journeyRepository: Repository<Journey>,
  ) {}

  async create(createMemoryDto: CreateMemoryDto, photo: Express.Multer.File): Promise<Memory> {
    const journey = await this.journeyRepository.findOne({ where: { id: createMemoryDto.journeyId } });
    if (!journey) {
      throw new NotFoundException(`Journey with ID "${createMemoryDto.journeyId}" not found`);
    }

    const memory = this.memoriesRepository.create({
      ...createMemoryDto,
      date: moment(createMemoryDto.date, 'DD/MM/YYYY').toDate(),
      photo: photo.buffer,
      photoMimeType: photo.mimetype,
      journey: journey,
    });

    return await this.memoriesRepository.save(memory);
  }

  async findAll(): Promise<Memory[]> {
    return await this.memoriesRepository.find();
  }

  async findOne(id: string): Promise<Memory> {
    const memory = await this.memoriesRepository.findOne({ where: { id } });
    if (!memory) {
      throw new NotFoundException(`Memory with ID "${id}" not found`);
    }
    return memory;
  }

  async getPhoto(id: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const memory = await this.memoriesRepository.findOne({ where: { id } });
    if (!memory || !memory.photo) {
      throw new NotFoundException(`Photo for memory with ID "${id}" not found`);
    }
    return { buffer: memory.photo, mimeType: memory.photoMimeType };
  }
}