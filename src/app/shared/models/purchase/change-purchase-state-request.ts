import {PurchaseState} from "./purchase-state";

export class ChangePurchaseStateRequest {
  purchaseId: number;
  newState: PurchaseState;
  note: string;
}
