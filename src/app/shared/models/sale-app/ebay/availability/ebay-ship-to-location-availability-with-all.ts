import {EbayFormatAllocation} from "./ebay-format-allocation";
import {EbayAvailabilityDistribution} from "./ebay-availability-distribution";

export class EbayShipToLocationAvailabilityWithAll {
  id: number;
  allocationByFormat: EbayFormatAllocation;
  availabilityDistributions: EbayAvailabilityDistribution[];
  quantity: number;
}
