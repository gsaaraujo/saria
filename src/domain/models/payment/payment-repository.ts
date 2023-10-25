import { Payment } from '@domain/models/payment/payment';

export interface PaymentRepository {
  create(payment: Payment): Promise<void>;
}
