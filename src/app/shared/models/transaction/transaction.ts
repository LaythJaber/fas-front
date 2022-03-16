import {TransactionStatus} from "./transaction-status";
import {Purchase} from "../purchase/purchase";
import {Payment} from "../payment/payment";
import {TransactionRow} from "./transaction-row";

export class Transaction {
  id: number;
  code: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  initialAmount: number;
  finalAmount: number;
  purchase: Purchase;
  payment: Payment;
  note: string;
  rowList: TransactionRow[];
}
