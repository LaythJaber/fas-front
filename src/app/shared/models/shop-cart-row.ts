import {Product} from "./product";

export class ShopCartRow {
  id: number;
  price: number; // final price = min(priceCalculated,priceInOffer)
  priceCalculated: number;
  quantity: number;
  rowTotal: number;
  modifiedPrice: number;
  supplement: number;
  threshold: number;
  replaceable: number;
  productFDto: Product;
  colorId: number;
  colorValue: string;
  sizeId: number;
  sizeValue: string;
}
