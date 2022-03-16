import { PaymentType } from './payment-type';
import {MovementType} from '../enum/movement-type';
import {PaymentMethodsType} from '../enum/payment-methods-type';
import {MovementProduct} from './movement-product';
import {TypeDocument} from '../enum/type-document';
import {Transaction} from './transaction/transaction';
import {Purchase} from './purchase/purchase';

export class Movement {
  id: number;
  number: number;
  createdAt: Date;
  updateAt: Date;
  seq: string;
  date: Date;
  type: MovementType;
  clientDescription: string;
  paymentTypeId?: number;
  paymentType?: PaymentType;
  totalQuantity: number;
  totalIva: number;
  totalTaxable: number;
  totalIvato: number;
  draft: boolean;
  inventoryId: null;
  products: MovementProduct[];
  note?: String;
  purchase?: Purchase;
  totalQuantityGR: number;
  totalQuantityML: number;
  totalQuantityPiece: number;
}
