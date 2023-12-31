import { describe, expect, it } from 'vitest';

import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { Payment } from '@domain/models/payment/payment';

describe('payment', () => {
  it('should create Payment', () => {
    const output: Payment = Payment.reconstitute({
      appointmentId: 'any',
      cardTokenId: 'any',
    });

    const sut: Either<BaseError, Payment> = Payment.create({
      appointmentId: 'any',
      cardTokenId: 'any',
    });

    expect(sut.isRight()).toBeTruthy();
    expect((sut.value as Payment).appointmentId).toBe(output.appointmentId);
    expect((sut.value as Payment).cardTokenId).toBe(output.cardTokenId);
  });
});
