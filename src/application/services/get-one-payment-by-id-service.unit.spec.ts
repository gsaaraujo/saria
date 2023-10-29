import { beforeEach, describe, expect, it } from 'vitest';

import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { PaymentNotFoundError } from '@application/errors/payment-not-found-error';
import {
  GetOnePaymentByIdService,
  GetOnePaymentByIdServiceOutput,
} from '@application/services/get-one-payment-by-id-service';

import { FakePaymentGateway } from '@infra/gateways/payment/fake-payment-gateway';

describe('get-one-payment-by-id-service', () => {
  let getOnePaymentByIdService: GetOnePaymentByIdService;
  let fakePaymentGateway: FakePaymentGateway;

  beforeEach(() => {
    fakePaymentGateway = new FakePaymentGateway();
    getOnePaymentByIdService = new GetOnePaymentByIdService(fakePaymentGateway);
  });

  it('should return one payment if its found', async () => {
    const output = {
      id: 'bce06489-6c19-4541-a642-8ab7d1a5ccfe',
      appointmentId: 'any',
      cardTokenId: 'any',
    };
    fakePaymentGateway.payments = [output];

    const sut: Either<BaseError, GetOnePaymentByIdServiceOutput> = await getOnePaymentByIdService.execute({
      id: 'bce06489-6c19-4541-a642-8ab7d1a5ccfe',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toEqual(output);
  });

  it('should return an error if payment is not found', async () => {
    fakePaymentGateway.payments = [];
    const output = new PaymentNotFoundError('Payment not found.');

    const sut: Either<BaseError, GetOnePaymentByIdServiceOutput> = await getOnePaymentByIdService.execute({
      id: 'any',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toEqual(output);
  });
});
