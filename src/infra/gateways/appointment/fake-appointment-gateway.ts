import { AppointmentGateway, AppointmentGatewayDTO } from '@application/gateways/appointment-gateway';

export class FakeAppointmentGateway implements AppointmentGateway {
  public appointments: AppointmentGatewayDTO[] = [];

  async exists(id: string): Promise<boolean> {
    return !!this.appointments.find((appointment) => appointment.id === id);
  }
}
