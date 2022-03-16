import {ReturnProductState} from "./return-product-state";
import {Account} from "../account.model";
import {ReturnInstructionAttachment} from "./return-instruction-attachment";

export class ReturnProductStateHistory {
  id: number;
  state: ReturnProductState;
  note: string;
  attachments: ReturnInstructionAttachment[];
  createdAt: string;
  operator: Account;
}
