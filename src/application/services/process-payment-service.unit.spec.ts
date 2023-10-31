import { it, describe, beforeEach, expect } from 'vitest';

import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { ProcessPaymentService } from '@application/services/process-payment-service';
import { AppointmentNotFoundError } from '@application/errors/appointment-not-found-error';

import { FakeQueueAdapter } from '@infra/adapters/queue/fake-queue-adapter';
import { FakePaymentRepository } from '@infra/repositories/fake-payment-repository';
import { FakeAppointmentGateway } from '@infra/gateways/appointment/fake-appointment-gateway';

describe('process-payment', () => {
  let processPayment: ProcessPaymentService;
  let fakePaymentRepository: FakePaymentRepository;
  let fakeAppointmentGateway: FakeAppointmentGateway;
  let fakeQueueAdapter: FakeQueueAdapter;

  beforeEach(() => {
    fakePaymentRepository = new FakePaymentRepository();
    fakeAppointmentGateway = new FakeAppointmentGateway();
    fakeQueueAdapter = new FakeQueueAdapter();
    processPayment = new ProcessPaymentService(fakeAppointmentGateway, fakePaymentRepository, fakeQueueAdapter);
  });

  it(`given the customer has booked an appointment
      when attempt to pay the appointment
      it should succeed`, async () => {
    fakeAppointmentGateway.appointments = [{ id: 'b6bba160-562a-4aea-bbba-2f03bef5071a', patientId: 'any' }];
    fakeQueueAdapter.messages = [];
    const sut: Either<BaseError, void> = await processPayment.execute({
      appointmentId: 'b6bba160-562a-4aea-bbba-2f03bef5071a',
      cardTokenId: 'any',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(fakeQueueAdapter.messages).toHaveLength(1);
  });

  it(`given the customer has not booked an appointment
      when attempt to pay the appointment
      it should fail`, async () => {
    fakeAppointmentGateway.appointments = [];
    const error: BaseError = new AppointmentNotFoundError('Appointment not found.');

    const sut: Either<BaseError, void> = await processPayment.execute({
      appointmentId: 'any',
      cardTokenId: 'any',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toStrictEqual(error);
  });
});
