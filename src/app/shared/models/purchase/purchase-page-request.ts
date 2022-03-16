import {LazyRequest} from "../../dto/lazy-request";
import {PurchaseState} from "./purchase-state";

export class PurchasePageRequest extends LazyRequest {
  state: PurchaseState;
  sellPointId: number = null;
  shipmentId: number = null;
  createdAt: string = '';
  updatedAt: string = '';
  paymentId: number = null;
}
