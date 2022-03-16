import {IvaCode} from './iva-code';
import {Provider} from './provider';
import {Category} from './category';
import {Brand} from './brand';
import {Linea} from './linea';
import {ProductUm} from './product-um';
import {Um} from './um';
import {ProductCode} from './product-code';
import {Reparto} from './reparto';
import {Tag} from './tag';
import {TranslationRequest} from './translation-request';
import {ProductTrans} from './product-trans';
import {Pack} from './pack';
import {SharedVariation, Values} from './shared-variation';
import {StockHistory} from './stock-history';

export class Product {

  id?: number;
  importedId: number;
  uuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
  description?: TranslationRequest[];
  translatedDesc?: string;
  commercialDescription?: string;
  transInfo?: ProductTrans[];
  note?: string;
  price?: number;
  priceSale?: number;
  recharge?: number;
  purchasePrice?: number;
  minStock?: number;
  measureUnit?: Um;
  activeDetailSale?: boolean;
  ecommerce?: boolean;
  meduimCost?: number;
  lastLoadingCost?: number;
  lastSalePrice?: number;
  stock?: number;
  disponibility?: number;
  availability?: number;

  enabled: boolean;

  taxId?: number;
  tax?: IvaCode;

  brandId?: number;
  brand?: Brand;

  lineaId?: number;
  linea?: Linea;

  repartoId?: number;
  reparto?: Reparto;

  providerId?: number;
  provider?: Provider;
  manufacturerId?: number;
  manufacturer?: Provider;
  ivaValue?: string;
  productUmRequestList?: ProductUm[];
  productUms?: ProductUm[];
  productCodeRequests?: ProductCode[];
  productCodes?: ProductCode[];
  rechargeSale?: number;
  // salePrice?: number;
  pricePerPrincipalMeasureUnit?: number;

  existsInPriceList?: boolean;
  disabled?: boolean;
  // originalCode?: string;
  originalDescription?: string;
  consultationNumber?: number;
  lastVisitedDate?: Date;

  weighted?: boolean; // vendu par poids ou par pièce
  weightUm?: string; // l'unité de mesure de poids
  weight?: number; // le poids du produit à vendre (300g | 700ml)
  netWeight?: number;
  weightType?: string;
  variableWeightSalePrice?: number;
  variableWeightPromoSalePrice?: number;
  variableWeightPurchasePrice?: number;
  lxwxh?: number;

  foodPairing?: string;
  alcoholPercentage?: number;
  grapeVineDesignation?: string;
  servingTemperature?: number;
  region?: string;
  typologia?: string;
  productHistory?: string;

  urlKey?: string;
  metaTitle?: string;
  metaKey?: string;
  metaDescription?: string;

  tagIds?: number[] = [];
  tags?: Tag[];
  categoriesId?: number[] = [];
  variationsId?: number[] = [];
  sharedVariationsId?: number[] = [];

  categoryList: Category[] = [];

  dateStartOff?: any; //(Date debut promo)
  dateEndOff?: any; //(Date debut promo)
  priceOff?: number;//(prix en promo)
  scontOff?: number; //(valeur remise %)
  desOff?: string;

  mainImage: string;

  packs: Pack[];

  inEvidenza: boolean;

  inOffer?: boolean;
  code;

  inLoading: boolean = false;
  sharedVariationList: SharedVariation[];
  colors: Values[];
  sizes: Values[];
  sizeName: string;

  unit?: string;

  editCode: boolean = false;
  histories?: StockHistory[] = [];

  type: ProductType;
}

export enum ProductType {
  FASHION = "FASHION",
  FOOD = "FOOD"
}

export class Variation {
  valId: number;
  value: string;
  name: string;
  code: string;
}
