import axios from 'axios';
import { AppointmentGateway, AppointmentGatewayDTO } from '@application/gateways/appointment-gateway';

export class AxiosAppointmentGateway implements AppointmentGateway {
  async findOneById(id: string): Promise<AppointmentGatewayDTO | null> {
    const response = await axios.get(`http://localhost:3001/appointments/${id}`);
    const rawData = response.data;

    return {
      id: rawData.id,
      patientId: rawData.patientId,
    };
  }
  async exists(id: string): Promise<boolean> {
    const response = await axios.get(`http://localhost:3001/appointments/${id}`);
    const rawData = response.data;

    return !!rawData;
  }
}
