import {ShopCartRow} from "./shop-cart-row";

export class ShopCart {
  id?: string;
  productsNumber?: number;
  productsTotal?: number;
  shippingCost?: number;
  supplements?: number;
  totalDiscount?: number;
  totalIncludingDiscount?: number;
  totalExcludingDiscount?: number;
  couponDiscount?: number;
  clientId?: number;
  enterpriseId?: number;
  sellpointId?: number;
  clientFirstName?: string;
  clientLastName?: string;
  clientCode?: string;

  createdAt?: string;
  updatedAt?: string;
  total?: number;
  shopCartRowDtoList?: ShopCartRow[];
}
