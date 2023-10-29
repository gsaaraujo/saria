import { Usecase } from '@shared/helpers/usecase';
import { BaseError } from '@shared/helpers/base-error';
import { Either, left, right } from '@shared/helpers/either';

import { PaymentNotFoundError } from '@application/errors/payment-not-found-error';
import { PaymentGatewatDTO, PaymentGateway } from '@application/gateways/payment-gateway';

export type GetOnePaymentByIdServiceInput = {
  id: string;
};

export type GetOnePaymentByIdServiceOutput = {
  id: string;
  appointmentId: string;
  cardTokenId: string;
};

export class GetOnePaymentByIdService extends Usecase<GetOnePaymentByIdServiceInput, GetOnePaymentByIdServiceOutput> {
  public constructor(private paymentGateway: PaymentGateway) {
    super();
  }

  public async execute(
    input: GetOnePaymentByIdServiceInput,
  ): Promise<Either<BaseError, GetOnePaymentByIdServiceOutput>> {
    const payment: PaymentGatewatDTO | null = await this.paymentGateway.findOneById(input.id);

    if (payment === null) {
      const error = new PaymentNotFoundError('Payment not found.');
      return left(error);
    }

    const output: GetOnePaymentByIdServiceOutput = {
      id: payment.id,
      appointmentId: payment.appointmentId,
      cardTokenId: payment.cardTokenId,
    };

    return right(output);
  }
}
