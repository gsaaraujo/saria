import { AppointmentGateway, AppointmentGatewayDTO } from '@application/gateways/appointment-gateway';

export class FakeAppointmentGateway implements AppointmentGateway {
  public appointments: AppointmentGatewayDTO[] = [];

  async exists(id: string): Promise<boolean> {
    return !!this.appointments.find((appointment) => appointment.id === id);
  }

  async findOneById(id: string): Promise<AppointmentGatewayDTO | null> {
    const appointment: AppointmentGatewayDTO | undefined = this.appointments.find(
      (appointment) => appointment.id === id,
    );

    if (appointment === undefined) {
      return null;
    }

    return {
      id: appointment.id,
      patientId: appointment.patientId,
    };
  }
}
