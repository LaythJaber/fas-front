import {ProductCode} from 'src/app/shared/models/product-code';
import {Product} from './product';

export class PriceList {
  id?: number;
  productId?: number;
  product?: Product;
  productCode?: string;
  productDescription?: string;

  priceList1Value?: number;
  priceList2Value?: number;
  priceList3Value?: number;
  priceList4Value?: number;

  priceList1FormulaField?: string;
  priceList2FormulaField?: string;
  priceList3FormulaField?: string;
  priceList4FormulaField?: string;

  description?: string;
  createdAt?: Date;
  updateAt?: Date;
  code?: string;
}
