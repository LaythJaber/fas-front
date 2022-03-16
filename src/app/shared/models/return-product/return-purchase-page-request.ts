import {LazyRequest} from "../../dto/lazy-request";
import {ReturnPurchaseState} from "./return-purchase-state";

export class ReturnPurchasePageRequest extends LazyRequest {
  state: ReturnPurchaseState = null;
  sellPointId: number = null;
  shipmentId: number = null;
  paymentId: number = null;
  createdAt: string = '';
  updatedAt: string = '';
}
