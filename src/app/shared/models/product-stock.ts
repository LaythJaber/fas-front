import {MovementType} from '../enum/movement-type';
export class ProductStock {
  id: number;
  productId: number;
  seq: string;
  prodCode: string;
  description: string;
  category: string;
  subCategory: string;
  minStock: number;
  active: boolean;
  stock: number;
  newStock: number;
  movementType?: MovementType;
  movementId?: number;
  stockType?: string;
  unit?: string;
  availability?: number;
}
