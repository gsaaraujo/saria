import { describe, expect, it } from 'vitest';

import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { Money } from '@domain/models/money';
import { Payment } from '@domain/models/payment/payment';

describe('payment', () => {
  it('should create Payment', () => {
    const output: Payment = Payment.reconstitute({
      appointmentId: 'any',
      price: Money.reconstitute({ amount: 140 }),
      creditCardToken: 'any',
    });

    const sut: Either<BaseError, Payment> = Payment.create({
      appointmentId: 'any',
      price: Money.create({ amount: 140 }).value as Money,
      creditCardToken: 'any',
    });

    expect(sut.isRight()).toBeTruthy();
    expect((sut.value as Payment).appointmentId).toBe(output.appointmentId);
    expect((sut.value as Payment).price.amount).toBe(output.price.amount);
    expect((sut.value as Payment).creditCardToken).toBe(output.creditCardToken);
  });
});
