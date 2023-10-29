import { z } from 'zod';
import { Request, Response } from 'express';

import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import {
  GetOnePaymentByIdService,
  GetOnePaymentByIdServiceOutput,
} from '@application/services/get-one-payment-by-id-service';
import { PaymentNotFoundError } from '@application/errors/payment-not-found-error';

export class ExpressGetOnePaymentByIdController {
  public constructor(private readonly getOnePaymentByIdService: GetOnePaymentByIdService) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const schema = z.object({
        id: z
          .string({ required_error: 'id is required', invalid_type_error: 'id must be string' })
          .trim()
          .uuid({ message: 'id must be uuid' }),
      });

      const body = schema.safeParse(request.params);

      if (!body.success) {
        const errors = JSON.parse(body.error.message).map((error: { message: string }) => error.message);
        return response.status(400).send({ errors });
      }

      const getOnePaymentByIdService: Either<BaseError, GetOnePaymentByIdServiceOutput> =
        await this.getOnePaymentByIdService.execute({
          id: request.params.id,
        });

      if (getOnePaymentByIdService.isRight()) {
        return response.status(200).send(getOnePaymentByIdService.value);
      }

      const baseError: BaseError = getOnePaymentByIdService.value;

      if (baseError instanceof PaymentNotFoundError) {
        return response.status(404).send({ error: baseError.message });
      }

      return response.status(500).send({
        errorMessage: 'Something unexpected happened',
      });
    } catch (error) {
      return response.status(500).send({
        errorMessage: 'Something unexpected happened',
      });
    }
  }
}
