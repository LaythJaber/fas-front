import { MeasureUnit } from '../enum/measure-unit.enum';
import { Product } from './product';
import { Um } from './um';

export class ProductUm {
id?: number;
productId?: number;
product?: Product;
um?: Um;
umId?: number;
multiply?: number;
description?: string;
index?: number;
}
