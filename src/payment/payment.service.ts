import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Journey } from 'src/journey/entities/journey.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private preference: Preference;
  private payment: Payment;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Journey)
    private readonly journeyRepository: Repository<Journey>,
  ) {
    const accessToken = this.configService.get<string>(
      'MERCADO_PAGO_ACCESS_TOKEN',
    );
    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not defined');
    }
    const client = new MercadoPagoConfig({ accessToken });
    this.preference = new Preference(client);
    this.payment = new Payment(client);
  }

  async createPayment(journeyId: string): Promise<any> {
    try {
      const response = await this.preference.create({
        body: {
          payment_methods: {
            excluded_payment_methods: [
              {
                id: 'bolbradesco',
              },
              {
                id: 'pec',
              },
            ],
            excluded_payment_types: [
              {
                id: 'debit_card',
              },
            ],
            installments: 1,
          },
          items: [
            {
              id: journeyId,
              title: `Love Journey ${journeyId}`,
              quantity: 1,
              unit_price: 0.01,
            },
          ],
          external_reference: journeyId,
          back_urls: {
            success: `${this.configService.get('FRONTEND_URL')}/payment/success`,
            failure: `${this.configService.get('FRONTEND_URL')}/payment/failure`,
            pending: `${this.configService.get('FRONTEND_URL')}/payment/pending`,
          },
          auto_return: 'all',
        },
      });

      this.logger.log(`Payment preference created for journey ${journeyId}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Error creating payment for journey ${journeyId}: ${error.message}`,
      );
      throw error;
    }
  }

  async getPaymentStatus(journeyId: string): Promise<any> {
    try {
      const payments = await this.payment.search({
        options: {
          criteria: 'desc',
          limit: 1,
        },
        // Use type assertion to include the filters property
        filters: {
          external_reference: journeyId,
        },
      } as any);

      if (payments.results.length > 0) {
        const latestPayment = payments.results[0];
        return {
          status: latestPayment.status,
          journeyId: journeyId,
        };
      } else {
        return {
          status: 'not_found',
          journeyId: journeyId,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error fetching payment status for journey ${journeyId}: ${error.message}`,
      );
      throw error;
    }
  }

  async handleWebhook(payload: any) {
    this.logger.log(
      `Received webhook notification: ${JSON.stringify(payload)}`,
    );

    if (payload.type === 'payment') {
      const paymentId = payload.data.id;
      try {
        const paymentInfo = await this.payment.get({ id: paymentId });
        await this.updatePaymentStatus(
          paymentInfo.external_reference,
          paymentInfo.status,
        );
      } catch (error) {
        this.logger.error(
          `Error processing webhook for payment ${paymentId}: ${error.message}`,
        );
        throw error;
      }
    }
  }

  private async updatePaymentStatus(journeyId: string, status: string) {
    try {
      const journey = await this.journeyRepository.findOne({
        where: { id: journeyId },
      });
      if (!journey) {
        throw new Error(`Journey with id ${journeyId} not found`);
      }

      journey.paymentStatus = status;
      journey.updatedAt = new Date();

      await this.journeyRepository.save(journey);

      this.logger.log(
        `Updated payment status for journey ${journeyId} to ${status}`,
      );
    } catch (error) {
      this.logger.error(
        `Error updating payment status for journey ${journeyId}: ${error.message}`,
      );
      throw error;
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const secretKey = this.configService.get<string>(
      'MERCADO_PAGO_WEBHOOK_SECRET',
    );
    const generatedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');

    return generatedSignature === signature;
  }
}
