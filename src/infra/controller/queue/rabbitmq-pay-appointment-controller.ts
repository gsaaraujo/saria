import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { QueueAdapter } from '@application/adapters/queue-adapter';
import { PayAppointmentService } from '@application/services/pay-appointment-service';
import { CardTokenGateway, CardTokenGatewayDTO } from '@application/gateways/card-token-gateway';
import { AppointmentGateway, AppointmentGatewayDTO } from '@application/gateways/appointment-gateway';

export class RabbitMQpayAppointmentController {
  public constructor(
    private readonly payAppointmentService: PayAppointmentService,
    private readonly appointmentGateway: AppointmentGateway,
    private readonly cardTokenGateway: CardTokenGateway,
    private readonly queueAdapter: QueueAdapter,
  ) {}

  public async handle(): Promise<void> {
    await this.queueAdapter.subscribe('AppointmentBooked', async (rawData: string) => {
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

      const payAppointmentService: Either<BaseError, void> = await this.payAppointmentService.execute({
        appointmentId: data.appointmentId,
        cardTokenId: cardToken.id,
      });

      return payAppointmentService.isRight();
    });
  }
}
