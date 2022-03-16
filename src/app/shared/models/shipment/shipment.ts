import {AuditSection} from "../audit-section";
import {ShipmentTranslation} from "./shipment-translation";
import {ShipmentCost} from "./shipment-cost";

export class Shipment {
  id: number;
  transInfo: ShipmentTranslation[];
  deliveryTime: string;
  enabled: boolean;
  shippingFees: boolean;
  shippingCosts: number; // en cas shippingFees est faux
  shipmentCostList: ShipmentCost[]; // en cas shippingFess est vrai
  auditSection: AuditSection;
}
