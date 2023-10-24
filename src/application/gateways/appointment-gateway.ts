export type AppointmentGatewayDTO = {
  id: string;
  patientId: string;
};

export interface AppointmentGateway {
  findOneById(id: string): Promise<AppointmentGatewayDTO | null>;
  exists(id: string): Promise<boolean>;
}
