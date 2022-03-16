import {ReturnInstructionAttachment} from "./return-instruction-attachment";
import {ReturnProductState} from "./return-product-state";
import {ReturnProductStateHistory} from "./return-product-state-history";
import {Product} from "../product";

export class ReturnProduct {
  id: number;

  totalReturn: number;
  totalRefunded: number;
  quantity: number;
  quantityRefunded: number;
  colorValue: string;
  sizeValue: string;

  rowId: number;
  product: Product;

  reason: string;
  attachments: ReturnInstructionAttachment[];

  state: ReturnProductState;
  stateHistoryList: ReturnProductStateHistory[];


  createdAt: string;
  updatedAt: string;

  stateInChange: boolean = false;
}
