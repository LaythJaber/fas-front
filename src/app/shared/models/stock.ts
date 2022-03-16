import { ProductCode } from 'src/app/shared/models/product-code';
import {StockHistory} from './stock-history';
import { Um } from './um';

export class Stock {
  id: number;
  seq: string;
  prodCode: string;
  description: string;
  commercialDescription: string;
  category: string;
  subCategory: string;
  subSubCategory: string;
  provider: string;
  measureUnit: Um;
  brand: string;
  linea: string;
  purchasePrice;
  mediumCost: number;
  iva: string;
  price: number;
  minStock: number;
  stock: number;
  createdAt: Date;
  active: boolean;
  withPhoto: boolean;
  histories: StockHistory[] = [];
  gift: number;
  lastCost: number;
  lastPrice: number;
  productCodes: ProductCode[] = [];
  availability?: number;
}

