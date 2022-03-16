import {TransactionStatus} from "./transaction-status";

export class TransactionRow {
  id: number;
  code: string;
  amount: number;
  status: TransactionStatus;
  errorCode: string;
  errorMessage: string;
  errorLink: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}
