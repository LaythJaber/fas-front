import {GoogleProductPrice} from "./google-product-price";
import {GoogleProductStatus} from "./google-product-status";

export class GoogleProduct {

  id:string;

  // identity
  gid: string;
  channel: string;
  contentLanguage: string;
  targetCountry: string;
  offerId: string; // id du produit
  gtin: string; // code ean

  // description
  title: string; // commercial Description
  description: string; // note prodotti

  // prices
  price: GoogleProductPrice; // prix
  salePrice: GoogleProductPrice; //  prix en offre
  salePriceEffectiveDate: string; // période de promotion

  // links
  link: string; // lien du produit dans notre site
  imageLink: string; // lien de l'image principale de produit
  additionalImageLinks: string[];

  // availability
  availability: string; // in stock, out of stock, limited
  availabilityDate: string; // start date of publication
  expirationDate: string; //  final date of publication
  sellOnGoogleQuantity: number; // quantity to buy on google merchant

  // caracteristics
  brand: string;
  color: string;
  condition: string;
  gender: string;
  googleProductCategory: string;
  adult: boolean;
  ageGroup: string;

  // ads
  adsGrouping: string;
  adsLabels: string[];
  adsRedirect: string;
  displayAdsId: string;
  displayAdsLink: string;
  displayAdsSimilarIds: string[];
  displayAdsTitle: string;
  displayAdsValue: number;

  // status
  status: GoogleProductStatus;

  inLoading: boolean = false;
}


export enum  SaleAppProductAvailability{
  IN_STOCK = "in stock",
  OUT_OF_STOCK = "out of stock",
  PREORDER = "preorder",
  BACKORDER = "backorder"
}

export enum  GoogleProductStatusEnum {
  APPROVED = "approved",
  DISAPPROVED = "disapproved",
  PENDING = "pending",
}

