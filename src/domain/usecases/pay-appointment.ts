import { Usecase } from '@shared/helpers/usecase';
import { BaseError } from '@shared/helpers/base-error';
import { Either, left, right } from '@shared/helpers/either';

import { AppointmentNotFoundError } from '@domain/errors/appointment-not-found-error';

import { QueueAdapter } from '@infra/adapters/queue/queue-adapter';
import { AppointmentGateway } from '@infra/gateways/appointment/appointment-gateway';
import { Payment } from '@domain/models/payment/payment';
import { Money } from '@domain/models/money';
import { PaymentApproved } from '@domain/models/events/appointment-paid';

export type PayAppointmentInput = {
  appointmentId: string;
  price: number;
  creditCardToken: string;
};

export type PayAppointmentOutput = void;

export class PayAppointment extends Usecase<PayAppointmentInput, PayAppointmentOutput> {
  public constructor(
    private readonly appointmentGateway: AppointmentGateway,
    private readonly queueAdapter: QueueAdapter,
  ) {
    super();
  }

  public async execute(input: PayAppointmentInput): Promise<Either<BaseError, void>> {
    const appointmentExists: boolean = await this.appointmentGateway.exists(input.appointmentId);

    if (!appointmentExists) {
      const error: BaseError = new AppointmentNotFoundError('Appointment not found.');
      return left(error);
    }

    const moneyOrError: Either<BaseError, Money> = Money.create({
      amount: input.price,
    });

    if (moneyOrError.isLeft()) {
      const error: BaseError = moneyOrError.value;
      return left(error);
    }

    const money: Money = moneyOrError.value;

    const paymentOrError: Either<BaseError, Payment> = Payment.create({
      appointmentId: input.appointmentId,
      creditCardToken: input.creditCardToken,
      price: money,
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
