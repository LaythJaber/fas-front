import {PaymentParameter} from "./payment-parameter";
import {PaymentType} from "./payment-type";
import {PaymentTranslation} from "./payment-translation";

export class Payment {
  id: number;
  code: string;
  description: string;
  type: PaymentType;
  secondary: boolean;
  percent: number;
  cost: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  parameterList: PaymentParameter[] = [];
  transInfo: PaymentTranslation[];
}
