import {EbayDimension} from "./ebay-dimension";
import {EbayWeight} from "./ebay-weight";

export class EbayPackageWeightAndSize {
  id: number;
  dimensions: EbayDimension;
  packageType: string;
  weight: EbayWeight;
}
