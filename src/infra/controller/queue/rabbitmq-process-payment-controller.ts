import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { QueueAdapter } from '@application/adapters/queue-adapter';
import { ProcessPaymentService } from '@application/services/process-payment-service';
import { CardTokenGateway, CardTokenGatewayDTO } from '@application/gateways/card-token-gateway';
import { AppointmentGateway, AppointmentGatewayDTO } from '@application/gateways/appointment-gateway';

export class RabbitMQprocessPaymentController {
  public constructor(
    private readonly processPaymentService: ProcessPaymentService,
    private readonly appointmentGateway: AppointmentGateway,
    private readonly cardTokenGateway: CardTokenGateway,
    private readonly queueAdapter: QueueAdapter,
  ) {}

  public async handle(): Promise<void> {
    await this.queueAdapter.subscribe('AppointmentBooked', async (rawData: string) => {
      try {
        const data = JSON.parse(rawData);

        if (data.appointmentId === undefined) {
          return false;
        }

        const appointment: AppointmentGatewayDTO | null = await this.appointmentGateway.findOneById(data.appointmentId);

        if (appointment === null) {
          return false;
        }

        const cardToken: CardTokenGatewayDTO | null = await this.cardTokenGateway.findOneByPatientId(
          appointment.patientId,
        );

        if (cardToken === null) {
          return false;
        }

        const processPaymentService: Either<BaseError, void> = await this.processPaymentService.execute({
          appointmentId: data.appointmentId,
          cardTokenId: cardToken.id,
        });

        return processPaymentService.isRight();
      } catch (error) {
        return false;
      }
    });
  }
}
