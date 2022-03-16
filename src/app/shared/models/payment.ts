import {PaymentEntry} from './payment-entry';
import {PaymentMethods} from './payment-methods';
import {Client} from './client';
import {Account} from './account.model';
// import {FidelityCard} from './fidelity-card';
import {PaymentStatus} from '../enum/payment-status';

export class Payment {
  id: number;
  creatAt?: Date;
  amount: number;
  clientId: number;
  reloadCardId: number;
  giftCardId: number;
  pointCardId: number;
  total: number;
  amountToPay: number;
  paymentsEntry: PaymentEntry[];
  paymentMethods: PaymentMethods[];

  client?: Client;
  // reloadCard?: FidelityCard;
  // giftCard?: FidelityCard;
  // pointCard?: FidelityCard;
  currentStatus?: PaymentStatus;
  historyStatus?: PaymentHistoryStatusDto[];
  account?: Account;

  bookingId: number;

  reset?: number;
  receipt?: number;
}

export class PaymentHistoryStatusDto {
  creatAt: Date;
  status: PaymentStatus;
  errorCode: string;
}
