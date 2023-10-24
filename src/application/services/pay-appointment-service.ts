import { Usecase } from '@shared/helpers/usecase';
import { BaseError } from '@shared/helpers/base-error';
import { Either, left, right } from '@shared/helpers/either';

import { Payment } from '@domain/models/payment/payment';
import { PaymentApproved } from '@domain/events/appointment-paid';

import { QueueAdapter } from '@application/adapters/queue-adapter';
import { AppointmentGateway } from '@application/gateways/appointment-gateway';
import { AppointmentNotFoundError } from '@application/errors/appointment-not-found-error';

export type PayAppointmentServiceInput = {
  appointmentId: string;
  paymentTokenId: string;
};

export type PayAppointmentServiceOutput = void;

export class PayAppointmentService extends Usecase<PayAppointmentServiceInput, PayAppointmentServiceOutput> {
  public constructor(
    private readonly appointmentGateway: AppointmentGateway,
    private readonly queueAdapter: QueueAdapter,
  ) {
    super();
  }

  public async execute(input: PayAppointmentServiceInput): Promise<Either<BaseError, void>> {
    const appointmentExists: boolean = await this.appointmentGateway.exists(input.appointmentId);

    if (!appointmentExists) {
      const error: BaseError = new AppointmentNotFoundError('Appointment not found.');
      return left(error);
    }

    const paymentOrError: Either<BaseError, Payment> = Payment.create({
      appointmentId: input.appointmentId,
      paymentTokenId: input.paymentTokenId,
    });

    if (paymentOrError.isLeft()) {
      const error: BaseError = paymentOrError.value;
      return left(error);
    }

    const payment: Payment = paymentOrError.value;
    const paymentApproved = new PaymentApproved(payment.id);
    await this.queueAdapter.publish('PaymentApproved', JSON.stringify(paymentApproved));

    return right(undefined);
  }
}
