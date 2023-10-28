export type CardTokenGatewayDTO = {
  id: string;
};

export interface CardTokenGateway {
  findOneByPatientId(id: string): Promise<CardTokenGatewayDTO | null>;
}
