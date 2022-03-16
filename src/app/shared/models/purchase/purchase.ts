import {Client} from "../client";
import {Address} from "../address";
import {Shipment} from "../shipment/shipment";
import {PurchaseState} from "./purchase-state";
import {SellPoint} from "../sell-point";
import {PurchaseRow} from "./purchase-row";
import {PurchaseSource} from "./purchase-source";
import {PurchaseStateHistory} from "./purchase-state-history";
import {Payment} from "../payment/payment";

export class Purchase {
  id: number;
  code: string;

  state: PurchaseState;
  stateHistoryList: PurchaseStateHistory[];

  createdAt: string;
  updatedAt: string;

  client: Client;
  address: Address;
  shipment: Shipment;

  billing: boolean;
  billingUrl: string;
  billingInUpload: boolean = false;

  initialTotal: number;
  finalTotal: number;

  initialProductTotal: number;
  finalProductTotal: number;

  initialDiscountTotal: number;
  finalDiscountTotal: number;

  initialShippingCost: number;
  finalShippingCost: number;

  initialSupplement: number;
  finalSupplement: number;

  initialConventionTotal: number;
  finalConventionTotal: number;

  initialTotalToPay: number;
  finalTotalToPay: number;

  sellPoint: SellPoint;

  noteClient: string;
  source: PurchaseSource;

  // for food manager connector
  sentToFoodManager: boolean;
  sentToFoodManagerAt: string;
  foodManagerPurchaseId: string;
  foodManagerError: string;

  // for sellPoint connector
  sentToSellPoint: boolean;
  sentToSellPointAt: string;
  sellPointPurchaseId: string;
  sellPointError: string;


  purchaseRowList: PurchaseRow[];

  paymentCostTotal: number;
  preauthorizedAmount: number;
  payment: Payment;
  secondaryPaymentList: Payment[];

  coupon: any;
  initialCouponDiscountTotal: number;
  finalCouponDiscountTotal: number;

  pickingListUrl: string;
  receiptUrl: string;
  pickingInChange: boolean = false;
  receiptInChange: boolean = false;

  stateInChange: boolean = false;
}
