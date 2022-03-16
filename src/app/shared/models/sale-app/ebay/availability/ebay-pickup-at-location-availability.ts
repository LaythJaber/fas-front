import {EbayTimeDuration} from "./ebay-time-duration";

export class EbayPickupAtLocationAvailability {
  id: number;
  availabilityType: string;
  fulfillmentTime: EbayTimeDuration;
  merchantLocationKey: string;
  quantity: number;
}
