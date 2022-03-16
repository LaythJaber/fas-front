import {PriceVariation} from '../enum/price-variation';
import {FieldType} from '../enum/field-type';

export class ProductConfig {
  id: number;
  manageStockBySp: boolean;
  priceVariation: PriceVariation;
  sharedFields: ProductCustomFields[];
  specificFields: ProductCustomFields[];
}

export class ProductCustomFields {
  id: number;
  description: string;
  type: FieldType;
  sharedField: boolean;
  inactive: boolean;
  productsId: number[];
}
