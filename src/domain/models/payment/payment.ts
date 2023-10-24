import { Entity } from '@shared/helpers/entity';
import { Either, right } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

export type PaymentProps = {
  appointmentId: string;
  paymentTokenId: string;
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

  get paymentTokenId(): string {
    return this._props.paymentTokenId;
  }
}
