export class CartRequest {
  clientId?: number;
  productId: number;
  quantity?: number = 1;
  colorId?: number;
  sizeId?: number;

  rowId?: string;
  purchaseRowId?: number;
}
