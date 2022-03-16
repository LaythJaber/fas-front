export class AmazonProduct {
  id: number;
  itemName: string;
  itemDescription: string;
  listingId: string;
  sellerSku: string;
  price: number;
  quantity: number;
  imageUrl: string;
  fulfillmentChannel: string;
  status: string;
  asin1: string;

  inLoading: boolean = false;
}

export enum  AmazonProductStatus {
  INCOMPLETE = "incomplete",
  ACTIVE = "active",
  INACTIVE = "inactive",
}
