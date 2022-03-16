import { MovementType } from '../enum/movement-type';

export class StockHistory {
  createdAt: Date;
  purchasePrice: number;
  totalPurchasePrice: number;
  price: number;
  quantity: number;
  gift: number;
  causal: MovementType;
  description: string;
  commercialDescription: string;
  stockType?: string;
}
