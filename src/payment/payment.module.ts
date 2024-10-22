import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Journey } from 'src/journey/entities/journey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Journey])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}