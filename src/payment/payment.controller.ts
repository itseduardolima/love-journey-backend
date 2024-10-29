import { Controller, Post, Get, Param,  } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':journeyId')
  @ApiOperation({ summary: 'Create a payment for a journey' })
  @ApiParam({ name: 'journeyId', type: 'string' })
  @ApiResponse({ status: 201, description: 'The payment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createPayment(
    @Param('journeyId') journeyId: string
  ) {
    return this.paymentService.createPayment(journeyId);
  }

  @Get(':journeyId/status')
  @ApiOperation({ summary: 'Get the payment status for a journey' })
  @ApiParam({ name: 'journeyId', type: 'string' })
  @ApiResponse({ status: 200, description: 'The payment status has been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  async getPaymentStatus(@Param('journeyId') journeyId: string) {
    return this.paymentService.getPaymentStatus(journeyId);
  }
}