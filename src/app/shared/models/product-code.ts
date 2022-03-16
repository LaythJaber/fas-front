import { ProductCodeType } from './../enum/product-code.enum-type';
import { Product } from './product';

export class ProductCode {
  id?: number;
  productId?: number;
  product?: Product;
  code: string;
  codeType: ProductCodeType;
  qta: string;
  supplierCode: string;
  customerCode: string;
  defaultCode: boolean;
  index?: number;
}
