import { it, describe, beforeEach, expect } from 'vitest';

import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { PayAppointment } from '@domain/usecases/pay-appointment';
import { AppointmentNotFoundError } from '@domain/errors/appointment-not-found-error';

import { FakeQueueAdapter } from '@infra/adapters/queue/fake-queue-adapter';
import { FakeAppointmentGateway } from '@infra/gateways/appointment/fake-appointment-gateway';

describe('pay-appointment', () => {
  let payAppointment: PayAppointment;
  let fakeAppointmentGateway: FakeAppointmentGateway;
  let fakeQueueAdapter: FakeQueueAdapter;

  beforeEach(() => {
    fakeAppointmentGateway = new FakeAppointmentGateway();
    fakeQueueAdapter = new FakeQueueAdapter();
    payAppointment = new PayAppointment(fakeAppointmentGateway, fakeQueueAdapter);
  });

  it(`given the customer has no booked appointment
      when attempt to pay the appointment
      it should fail`, async () => {
    fakeAppointmentGateway.appointments = [];
    const error: BaseError = new AppointmentNotFoundError('Appointment not found.');

    const sut: Either<BaseError, void> = await payAppointment.execute({ appointmentId: 'any' });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(error);
  });
});
