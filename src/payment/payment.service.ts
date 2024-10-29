import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private preference: Preference;
  private payment: Payment;

  constructor(private configService: ConfigService) {
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
              title: "Love Journey",
              quantity: 1,
              unit_price: 15.00,
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
}
