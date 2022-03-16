import {ReturnPurchaseState} from "./return-purchase-state";
import {Purchase} from "../purchase/purchase";
import {ReturnProduct} from "./return-product";

export class ReturnPurchase {
  id: number;
  code: string;
  state: ReturnPurchaseState;

  totalReturn: number;
  totalQuantity: number;
  totalRefunded: number;
  totalQuantityRefunded: number;

  purchase: Purchase;
  returnProducts: ReturnProduct[];

  createdAt: string;
  updatedAt: string;

  stateInChange: boolean = false;
}
