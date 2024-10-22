import { Controller, Post, Get, Param, Body, Headers, HttpCode, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
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

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Handle MercadoPago webhook notifications' })
  @ApiBody({ description: 'Webhook payload' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid signature' })
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature: string
  ): Promise<{ received: boolean }> {
    if (!this.paymentService.verifyWebhookSignature(JSON.stringify(payload), signature)) {
      throw new UnauthorizedException('Invalid signature');
    }

    await this.paymentService.handleWebhook(payload);
    return { received: true };
  }
}