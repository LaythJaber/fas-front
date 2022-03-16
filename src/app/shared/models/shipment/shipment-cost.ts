import {ShipmentCostType} from "./shipment-cost-type";

export class ShipmentCost {
  id: number;
  type: ShipmentCostType;
  minExpense: number;
  maxExpense: number;
  cost: number;
}
