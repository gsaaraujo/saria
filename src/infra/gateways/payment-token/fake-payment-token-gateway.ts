import { PaymentTokenGateway, PaymentTokenGatewayDTO } from '@application/gateways/payment-token-gateway';

export class FakePaymentTokenGateway implements PaymentTokenGateway {
  public paymentTokens: PaymentTokenGatewayDTO[] = [];

  async findOneByPatientId(id: string): Promise<PaymentTokenGatewayDTO | null> {
    const paymentToken: PaymentTokenGatewayDTO | undefined = this.paymentTokens.find(
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
