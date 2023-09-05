import { Usecase } from '@shared/helpers/usecase';
import { BaseError } from '@shared/helpers/base-error';
import { Either, left, right } from '@shared/helpers/either';

import { AppointmentNotFoundError } from '@domain/errors/appointment-not-found-error';

import { QueueAdapter } from '@infra/adapters/queue/queue-adapter';
import { AppointmentGateway } from '@infra/gateways/appointment/appointment-gateway';

export type PayAppointmentInput = {
  appointmentId: string;
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

    return right(undefined);
  }
}
