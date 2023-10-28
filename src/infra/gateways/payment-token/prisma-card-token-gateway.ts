import { PrismaClient, CardToken as PrismaCardToken } from '@prisma/client';

import { CardTokenGateway, CardTokenGatewayDTO } from '@application/gateways/card-token-gateway';

export class PrismaPaymentTokenGateway implements CardTokenGateway {
  public constructor(private readonly prismaClient: PrismaClient) {}

  async findOneByPatientId(id: string): Promise<CardTokenGatewayDTO | null> {
    const cardToken: PrismaCardToken | null = await this.prismaClient.cardToken.findFirst({
      where: {
        patientId: id,
      },
    });

    if (cardToken === null) return null;

    return {
      id: cardToken.id,
    };
  }
}
