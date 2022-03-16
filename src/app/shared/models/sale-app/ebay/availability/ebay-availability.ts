import {EbayPickupAtLocationAvailability} from "./ebay-pickup-at-location-availability";
import {EbayShipToLocationAvailabilityWithAll} from "./ebay-ship-to-location-availability-with-all";

export class EbayAvailability {
  id: number;
  pickupAtLocationAvailability: EbayPickupAtLocationAvailability[];
  shipToLocationAvailability: EbayShipToLocationAvailabilityWithAll;
}
