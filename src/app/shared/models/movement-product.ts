import { PriceList } from './price-list';
import { RowType } from '../enum/row-type.enum';
import { ProductCode } from './product-code';

export class MovementProduct {
  id: number;
  seq: string;
  productId: number;
  description: string;
  quantity: number;
  quantityUm: number;
  value: number;//purchase cost
  measureUnitId: number;
  discount: number;
  discountFormula: string;
  discountCalculated: number; // Hidden : (value – exec(discount_formula) – discount
  calculatedValue: number;//value – discount_calculated
  calculatedTotalValue: number; //calculated_value * calculated_total_value
  rowType: RowType;
  productCodes?: ProductCode[];
  productDescription?: string;
  productCode?: string;
  priceList?: PriceList;
  stockType?: string;
  unit?: string;
}
