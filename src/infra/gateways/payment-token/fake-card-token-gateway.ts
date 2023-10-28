import { CardTokenGateway, CardTokenGatewayDTO } from '@application/gateways/card-token-gateway';

export class FakeCardTokenGateway implements CardTokenGateway {
  public paymentTokens: CardTokenGatewayDTO[] = [];

  async findOneByPatientId(id: string): Promise<CardTokenGatewayDTO | null> {
    const paymentToken: CardTokenGatewayDTO | undefined = this.paymentTokens.find(
      (appointment) => appointment.id === id,
    );

    if (paymentToken === undefined) {
      return null;
    }

    return {
      id: paymentToken.id,
    };
  }
}
