export type PaymentMethod = "PAYOS";

export interface PaymentCreateRequest {
  userId: string;
  bundleId: string;
  durationCode: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentCreateResponse {
  paymentUrl: string;
  orderId: string;
}
