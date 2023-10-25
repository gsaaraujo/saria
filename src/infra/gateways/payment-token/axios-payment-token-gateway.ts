import { PaymentTokenGateway, PaymentTokenGatewayDTO } from '@application/gateways/payment-token-gateway';

export class AxiosPaymentTokenGateway implements PaymentTokenGateway {
  async findOneByPatientId(id: string): Promise<PaymentTokenGatewayDTO | null> {
    return {
      id: 'ae0cc0c0-a48e-46d2-bebc-4d86111acdce',
    };
  }
}
