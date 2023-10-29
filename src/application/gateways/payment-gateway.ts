export type PaymentGatewatDTO = {
  id: string;
  appointmentId: string;
  cardTokenId: string;
};

export interface PaymentGateway {
  findOneById(id: string): Promise<PaymentGatewatDTO | null>;
}
