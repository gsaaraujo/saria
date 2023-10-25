import { Payment } from '@domain/models/payment/payment';
import { PaymentRepository } from '@domain/models/payment/payment-repository';

export class FakePaymentRepository implements PaymentRepository {
  public payment: Payment[] = [];

  async create(payment: Payment): Promise<void> {
    this.payment.push(payment);
  }
}
