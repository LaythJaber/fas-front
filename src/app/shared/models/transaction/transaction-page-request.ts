import {LazyRequest} from "../../dto/lazy-request";
import {TransactionStatus} from "./transaction-status";
import {PaymentType} from "../payment/payment-type";

export class TransactionPageRequest extends LazyRequest {
  state: TransactionStatus;
  paymentId: number = null;
  sellPointId: number = null;
  createdAt: string = '';
  updatedAt: string = '';

}
