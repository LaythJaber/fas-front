export class SaleApp {
  id: number;
  createdAt: string;
  updatedAt: string;

  // google
  googleMerchantEnabled: boolean;
  googleMerchantUserId: string;
  googleMerchantDomain: string;

  // ebay
  ebayEnabled: boolean;
  ebayUuid: string;

  // amazon
  amazonEnabled: boolean;
  amazonUuid: string;

}
