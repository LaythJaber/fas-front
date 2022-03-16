import { Payment } from '../models/payment';

export class PaymentStatsDto{
     creatAt: Date;
     payments: Payment[];
     sum: number;
}