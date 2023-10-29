import { PaymentGatewatDTO, PaymentGateway } from '@application/gateways/payment-gateway';

export class FakePaymentGateway implements PaymentGateway {
  public payments: PaymentGatewatDTO[] = [];

  public async findOneById(id: string): Promise<PaymentGatewatDTO | null> {
    const payment: PaymentGatewatDTO | undefined = this.payments.find((payment) => payment.id === id);

    if (payment === undefined) {
      return null;
    }

    return payment;
  }
}
