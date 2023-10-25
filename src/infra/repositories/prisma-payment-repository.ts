import { PrismaClient } from '@prisma/client';

import { Payment } from '@domain/models/payment/payment';
import { PaymentRepository } from '@domain/models/payment/payment-repository';

export class PrismaPaymentRepository implements PaymentRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  async create(payment: Payment): Promise<void> {
    await this.prisma.payment.create({
      data: {
        id: payment.id,
        appointmentId: payment.appointmentId,
        paymentTokenId: payment.paymentTokenId,
      },
    });
  }
}
