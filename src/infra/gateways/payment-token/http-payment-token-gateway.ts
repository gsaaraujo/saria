import { PaymentTokenGateway, PaymentTokenGatewayDTO } from '@application/gateways/payment-token-gateway';

import { HttpAdapter } from '@infra/adapters/http/http-adapter';

type PaymentToken = {
  id: string;
};

type Error = {
  error: string;
};

export class HttpPaymentTokenGateway implements PaymentTokenGateway {
  public constructor(private readonly httpAdapter: HttpAdapter) {}

  async findOneByPatientId(id: string): Promise<PaymentTokenGatewayDTO | null> {
    const response = await this.httpAdapter.get<PaymentToken | Error>(`http://xpto/payment-token/${id}`);

    if ('error' in response) {
      return null;
    }

    return {
      id: response.id,
    };
  }
}
