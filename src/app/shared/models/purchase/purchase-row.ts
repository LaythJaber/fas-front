import {Product} from "../product";

export  class PurchaseRow {
  id: number;
  sequence: number;

  createdAt: string;
  updatedAt: string;

  weighted: boolean;
  priceKgLtrUm: string;
  priceKgLtr: number;
  weight: number;
  weightUm: string;

  finalPrice: number;
  price: number;
  inOffer: boolean;
  priceInOffer: number;
  couponUnitPrice: number;
  couponTotalPrice: number;
  discount: number;

  quantityOrdered: number;
  quantityDelivered: number;

  rowTotal: number;

  supplement: number;
  threshold: number;
  replaceable: boolean;
  colorId: number;
  colorValue: string;
  sizeId: number;
  sizeValue: string;

  returned: boolean; // client fait retourner ce produit

  added: boolean;
  replacedByRowId: number;
  replaceRowId: number;

  product: Product;

  editQte: boolean = false;
}
