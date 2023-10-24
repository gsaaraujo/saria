export type PaymentTokenGatewayDTO = {
  id: string;
};

export interface PaymentTokenGateway {
  findOneByPatientId(id: string): Promise<PaymentTokenGatewayDTO | null>;
}
