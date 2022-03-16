import {PurchaseState} from "./purchase-state";
import {Account} from "../account.model";

export class PurchaseStateHistory {
  id: number;

  state: PurchaseState;
  createdAt: string;

  note: string;

  operator: Account;
}
