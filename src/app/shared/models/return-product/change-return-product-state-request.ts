import {ReturnProductState} from "./return-product-state";

export class ChangeReturnProductStateRequest {
  returnProductId: number;
  newState: ReturnProductState;
  note: string;
  totalRefunded: number;
  quantityRefunded: number;
}
