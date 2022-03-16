import { Product } from "./product";

export class ProductTrans{
  id?: number;
  langCodeId?: number;
  langCode?: string;

  description?: string;
  commercialDescription?: string;
  note?: string;
  allergies?: string;
  ingredients?: string;

  product?:Product
  productId?: number
}
