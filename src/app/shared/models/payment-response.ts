export class PaymentResponse {
  cmd: string;
  cmds: string[];
  ip: string;
  status;
  paymentId: number;
  configRtId: number;
  errorCode: string;
  fiscalTicket: boolean;
}
