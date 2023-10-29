import { AppointmentGateway, AppointmentGatewayDTO } from '@application/gateways/appointment-gateway';

import { HttpAdapter } from '@infra/adapters/http/http-adapter';

type Appointment = {
  id: string;
  patientId: string;
};

type Error = {
  error: string;
};

export class HttpAppointmentGateway implements AppointmentGateway {
  public constructor(private readonly httpAdapter: HttpAdapter) {}

  async findOneById(id: string): Promise<AppointmentGatewayDTO | null> {
    const response = await this.httpAdapter.get<Appointment | Error>(`http://localhost:3000/appointments/${id}`);

    if ('error' in response) {
      return null;
    }

    return {
      id: response.id,
      patientId: response.patientId,
    };
  }

  async exists(id: string): Promise<boolean> {
    const response = await this.httpAdapter.get<Appointment | Error>(`http://localhost:3000/appointments/${id}/exists`);

    if ('error' in response) {
      return false;
    }

    return true;
  }
}
