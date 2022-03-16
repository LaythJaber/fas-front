import {PaymentStatus} from '../enum/payment-status';

export class PaymentHistoryRequest {
  paymentId: number;
  configRtId: number;
  status: PaymentStatus;
  errorCode: string;
  bookingId: number;
}
