import {EbayTimeDuration} from "./ebay-time-duration";

export class EbayAvailabilityDistribution {
  id: number;
  fulfillmentTime: EbayTimeDuration;
  merchantLocationKey: string;
  quantity: number;
}
