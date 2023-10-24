import { Either } from '@shared/helpers/either';
import { BaseError } from '@shared/helpers/base-error';

import { QueueAdapter } from '@application/adapters/queue-adapter';
import { PayAppointmentService } from '@application/services/pay-appointment-service';
import { AppointmentGateway, AppointmentGatewayDTO } from '@application/gateways/appointment-gateway';
import { PaymentTokenGatewayDTO, PaymentTokenGateway } from '@application/gateways/payment-token-gateway';

export class RabbitMQpayAppointmentController {
  public constructor(
    private readonly payAppointmentService: PayAppointmentService,
    private readonly appointmentGateway: AppointmentGateway,
    private readonly paymentTokenGateway: PaymentTokenGateway,
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

      const paymentToken: PaymentTokenGatewayDTO | null = await this.paymentTokenGateway.findOneByPatientId(
        appointment.patientId,
      );

      if (paymentToken === null) {
        return false;
      }

      const payAppointmentService: Either<BaseError, void> = await this.payAppointmentService.execute({
        appointmentId: data.appointmentId,
        paymentTokenId: paymentToken.id,
      });

      return payAppointmentService.isRight();
    });
  }
}
