import { Entity } from '@shared/helpers/entity';
import { Either, right } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { Money } from '@domain/models/money';

export type PaymentProps = {
  appointmentId: string;
  price: Money;
  creditCardToken: string;
};

export class Payment extends Entity<PaymentProps> {
  public static create(props: PaymentProps): Either<BaseError, Payment> {
    const payment = new Payment(props);
    return right(payment);
  }

  public static reconstitute(props: PaymentProps): Payment {
    return new Payment(props);
  }

  get appointmentId(): string {
    return this._props.appointmentId;
  }

  get price(): Money {
    return this._props.price;
  }

  get creditCardToken(): string {
    return this._props.creditCardToken;
  }
}
