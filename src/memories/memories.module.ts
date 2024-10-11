import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoriesService } from './memories.service';
import { MemoriesController } from './memories.controller';
import { Memory } from './entities/memory.entity';
import { Journey } from '../journey/entities/journey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Memory, Journey])],
  providers: [MemoriesService],
  controllers: [MemoriesController],
  exports: [MemoriesService],
})
export class MemoriesModule {}