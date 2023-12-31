import { Usecase } from '@shared/helpers/usecase';
import { BaseError } from '@shared/helpers/base-error';
import { Either, left, right } from '@shared/helpers/either';

import { Payment } from '@domain/models/payment/payment';
import { PaymentProcessed } from '@domain/events/payment-processed';
import { PaymentRepository } from '@domain/models/payment/payment-repository';

import { QueueAdapter } from '@application/adapters/queue-adapter';
import { AppointmentGateway } from '@application/gateways/appointment-gateway';
import { AppointmentNotFoundError } from '@application/errors/appointment-not-found-error';

export type ProcessPaymentServiceInput = {
  appointmentId: string;
  cardTokenId: string;
};

export type ProcessPaymentServiceOutput = void;

export class ProcessPaymentService extends Usecase<ProcessPaymentServiceInput, ProcessPaymentServiceOutput> {
  public constructor(
    private readonly appointmentGateway: AppointmentGateway,
    private readonly paymentRepository: PaymentRepository,
    private readonly queueAdapter: QueueAdapter,
  ) {
    super();
  }

  public async execute(input: ProcessPaymentServiceInput): Promise<Either<BaseError, void>> {
    const appointmentExists: boolean = await this.appointmentGateway.exists(input.appointmentId);

    if (!appointmentExists) {
      const error: BaseError = new AppointmentNotFoundError('Appointment not found.');
      return left(error);
    }

    const paymentOrError: Either<BaseError, Payment> = Payment.create({
      appointmentId: input.appointmentId,
      cardTokenId: input.cardTokenId,
    });

    if (paymentOrError.isLeft()) {
      const error: BaseError = paymentOrError.value;
      return left(error);
    }

    const payment: Payment = paymentOrError.value;

    await this.paymentRepository.create(payment);
    const paymentProcessed = new PaymentProcessed(payment.id);
    await this.queueAdapter.publish(
      'PaymentProcessed',
      JSON.stringify({
        paymentId: paymentProcessed.aggregateId,
        dateTimeOccurred: paymentProcessed.dateTimeOccurred,
      }),
    );

    return right(undefined);
  }
}
