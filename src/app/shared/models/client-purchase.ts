import {SearchResponse} from '../dto/search-response';
export class ClientPurchase {
  firstPassage: Date;
  lastPassage: Date;
  totalProductPurchase: number;
  totalTreatmentPurchase: number;
  totalPurchase: number;
  totalProductPurchaseDiscount: number;
  totalTreatmentPurchaseDiscount: number;
  totalPurchaseDiscount: number;
  purchaseDetails: SearchResponse<PurchaseDetails>;
}

export class PurchaseDetails {
  description: string;
  creatAt: Date;
  discount: number;
  price: number;
  quantity: number;
}
