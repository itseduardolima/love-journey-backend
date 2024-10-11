import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JourneyController } from './journey.controller';
import { JourneyService } from './journey.service';
import { Journey } from './entities/journey.entity';
import { MemoriesModule } from '../memories/memories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journey]),
    MemoriesModule
  ],
  controllers: [JourneyController],
  providers: [JourneyService],
})
export class JourneyModule {}