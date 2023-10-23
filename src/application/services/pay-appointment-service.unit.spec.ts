import { it, describe, beforeEach, expect } from 'vitest';

import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { FakeQueueAdapter } from '@infra/adapters/queue/fake-queue-adapter';
import { FakeAppointmentGateway } from '@infra/gateways/appointment/fake-appointment-gateway';

import { PayAppointmentService } from '@application/services/pay-appointment-service';
import { AppointmentNotFoundError } from '@application/errors/appointment-not-found-error';

describe('pay-appointment', () => {
  let payAppointment: PayAppointmentService;
  let fakeAppointmentGateway: FakeAppointmentGateway;
  let fakeQueueAdapter: FakeQueueAdapter;

  beforeEach(() => {
    fakeAppointmentGateway = new FakeAppointmentGateway();
    fakeQueueAdapter = new FakeQueueAdapter();
    payAppointment = new PayAppointmentService(fakeAppointmentGateway, fakeQueueAdapter);
  });

  it(`given the customer has booked an appointment
      when attempt to pay the appointment
      it should succeed`, async () => {
    fakeAppointmentGateway.appointments = [{ id: 'b6bba160-562a-4aea-bbba-2f03bef5071a' }];
    fakeQueueAdapter.messages = [];
    const sut: Either<BaseError, void> = await payAppointment.execute({
      appointmentId: 'b6bba160-562a-4aea-bbba-2f03bef5071a',
      creditCardToken: 'any',
      price: 140,
    });

    expect(sut.isRight()).toBeTruthy();
    expect(fakeQueueAdapter.messages).toHaveLength(1);
  });

  it(`given the customer has not booked an appointment
      when attempt to pay the appointment
      it should fail`, async () => {
    fakeAppointmentGateway.appointments = [];
    const error: BaseError = new AppointmentNotFoundError('Appointment not found.');

    const sut: Either<BaseError, void> = await payAppointment.execute({
      appointmentId: 'any',
      creditCardToken: 'any',
      price: 140,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(error);
  });
});
