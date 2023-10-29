import { PrismaClient, Payment as PrismaPayment } from '.prisma/client';

import { PaymentGatewatDTO, PaymentGateway } from '@application/gateways/payment-gateway';

export class PrismaPaymentGateway implements PaymentGateway {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async findOneById(id: string): Promise<PaymentGatewatDTO | null> {
    const payment: PrismaPayment | null = await this.prismaClient.payment.findUnique({
      where: { id },
    });

    if (payment === null) {
      return null;
    }

    return {
      id: payment.id,
      appointmentId: payment.appointmentId,
      cardTokenId: payment.cardTokenId,
    };
  }
}
