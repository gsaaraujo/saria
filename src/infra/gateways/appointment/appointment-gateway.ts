export type AppointmentGatewayDTO = {
  id: string;
};

export interface AppointmentGateway {
  exists(id: string): Promise<boolean>;
}
