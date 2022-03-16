import {ProductStock} from './product-stock';

export class Inventory {
  id: number;
  number: string;
  creatAt: Date;
  draft: boolean;
  note: string;
  products: ProductStock[] = [];
  movementId: number;
}
