import {EbayProduct} from "./ebay-product";
import {EbayAvailability} from "./availability/ebay-availability";
import {EbayPackageWeightAndSize} from "./packages/ebay-package-weight-and-size";

export class EbayInventoryItem {
  id?: number;
  sku?: string;
  product?: EbayProduct;
  availability?: EbayAvailability;
  condition?: string;
  conditionDescription?: string;
  groupIds?: string[];
  inventoryItemGroupKeys?: string[];
  locale?: string;
  packageWeightAndSize?: EbayPackageWeightAndSize;

  inLoading?: boolean = false;
}
