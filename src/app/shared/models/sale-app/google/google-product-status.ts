export class GoogleProductStatus {
  creationDate?: string;
  destinationStatuses: ProductStatusDestinationStatus[];
  googleExpirationDate?: string;
  itemLevelIssues: ProductStatusItemLevelIssue[];
  kind?: string;
  lastUpdateDate?: string;
  link?: string;
  productId?: string;
  title?: string;
}

export class ProductStatusDestinationStatus {
  destination?: string; // SurfacesAcrossGoogle, ShoppingAds, etc
  status?: string;
  approvedCountries?: string[];
  pendingCountries?: string[];
  disapprovedCountries?: string[];
}

export  class ProductStatusItemLevelIssue {
  attributeName?: string;
  code?: string;
  destination?: string;
  description?: string;
  detail?: string;
  documentation?: string;
  resolution?: string;
  servability?: string;
}
