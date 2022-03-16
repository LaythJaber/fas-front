import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {LocalTranslate} from "../../pipes/local-translate";
import {EbayProductPageRequest} from "../../models/sale-app/ebay/ebay-product-page-request";
import {SearchResponse} from "../../dto/search-response";
import {EbayInventoryItem} from "../../models/sale-app/ebay/ebay-inventory-item";
import {Product} from "../../models/product";
import {EbayAvailability} from "../../models/sale-app/ebay/availability/ebay-availability";
import {EbayShipToLocationAvailabilityWithAll} from "../../models/sale-app/ebay/availability/ebay-ship-to-location-availability-with-all";
import {EbayProduct} from "../../models/sale-app/ebay/ebay-product";

@Injectable({
  providedIn: 'root',
})
export class EbayService {

  SALE_APP_API = environment.api + '/sale-app'
  EBAY_CONFIG_API = environment.hubSellerApi + '/ebay/config';
  EBAY_PRODUCTS_API = environment.hubSellerApi + '/ebay/products';
  EBAY_OFFERS_API = environment.hubSellerApi + '/ebay/offers';

  constructor(
    private http: HttpClient,
    private localTranslate: LocalTranslate
  ) {
  }


  getProductList(uuid: string, request: EbayProductPageRequest) {
    const headers = {
      'X-TENANT-ID': 'sc-ebay-'+uuid
    };
    return this.http.post<SearchResponse<EbayInventoryItem>>(`${this.EBAY_PRODUCTS_API}/filter`, request,{headers});
  }

  synchronizeEbay(uuid: string) {
    const headers = {'UUID': uuid};
    return this.http.get<any>(`${this.EBAY_CONFIG_API}/synchronize`,{headers});
  }

  /** Add  functions ****/

  addProduct(uuid: string, sku: string, lang: string, ebayInventoryItem: EbayInventoryItem) {
    const headers = {'UUID': uuid};
    return this.http.post<any>(`${this.EBAY_PRODUCTS_API}/add-one?sku=${sku}&lang=${lang}`, ebayInventoryItem,  {headers});
  }

  addSelectedProductList(uuid: string, items: EbayInventoryItem[]) {
    const headers = {'UUID': uuid};
    return this.http.post<any>(`${this.EBAY_PRODUCTS_API}/add-list`, items,  {headers});
  }

  /** via backoffice to get all the filtered products ***/
  addFilteredProductList(request) {
    return this.http.post<any>(`${this.SALE_APP_API}/ebay/add-list`, request, {observe: "response"});
  }


  /**** Delete functions ***/

  deleteProduct(uuid: string, sku: string) {
    const headers = {'UUID': uuid};
    return this.http.delete<any>(`${this.EBAY_PRODUCTS_API}/delete-one/${sku}`, {headers});
  }

  deleteProductList(uuid: string, skus: string[]) {
    const headers = {'UUID': uuid};
    return this.http.post<any>(`${this.EBAY_PRODUCTS_API}/delete-list`, skus, {headers});
  }

  deleteAllProduct(uuid: string,) {
    const headers = {'UUID': uuid};
    return this.http.delete<any>(`${this.EBAY_PRODUCTS_API}/delete-all`, {headers});
  }


  /************* offers ****************/

  addOffer(uuid: string, lang: string, ebayOffer) {
    const headers = {'UUID': uuid};
    return this.http.post<any>(`${this.EBAY_OFFERS_API}/add-one?lang=${lang}`, ebayOffer,  {headers});
  }

  addListOffer(uuid: string, ebayOffers: any[]) {
    const headers = {'UUID': uuid};
    return this.http.post<any>(`${this.EBAY_OFFERS_API}/add-list`, ebayOffers,  {headers});
  }

  updateOffer(uuid: string, lang: string, ebayOfferId, ebayOffer) {
    const headers = {'UUID': uuid};
    return this.http.put<any>(`${this.EBAY_OFFERS_API}/update-one/${ebayOfferId}?lang=${lang}`,
      ebayOffer,  {headers});
  }

  publishOffer(uuid: string, ebayOfferId) {
    const headers = {'UUID': uuid};
    return this.http.get<any>(`${this.EBAY_OFFERS_API}/publish-one/${ebayOfferId}`,  {headers});
  }

  deleteOffer(uuid: string, ebayOfferId) {
    const headers = {'UUID': uuid};
    return this.http.delete<any>(`${this.EBAY_OFFERS_API}/delete-one/${ebayOfferId}`,  {headers});
  }

  getOffersBySku(uuid: string, sku: string, marketplaceId) {
    const headers = {'UUID': uuid};
    return this.http.get<any>(`${this.EBAY_OFFERS_API}/get-list?format=FIXED_PRICE&limit=200
    &marketplaceId=${marketplaceId}&offset=0&sku=${sku}`,  {headers});
  }



  /** mapping ***/

  mapToEbayInventoryItem(product: Product, withLocales: boolean = false): EbayInventoryItem {
    const  ebayItem: EbayInventoryItem = new EbayInventoryItem();

    ebayItem.condition = 'NEW';
    ebayItem.conditionDescription = '';

    ebayItem.availability = new EbayAvailability();
    ebayItem.availability.shipToLocationAvailability = new EbayShipToLocationAvailabilityWithAll();
    ebayItem.availability.shipToLocationAvailability.quantity = product.stock;
    // ebayItem.availability.shipToLocationAvailability.quantity = 1;

    ebayItem.product = new EbayProduct();
    ebayItem.product.title =  this.localTranslate.transform(product, "commercialDescription");
    ebayItem.product.description =  this.localTranslate.transform(product, "note");
    ebayItem.product.brand = product.brand ? product.brand.description : 'Unbranded';
    ebayItem.product.mpn = product.manufacturer ? product.manufacturer.businessName : 'Does Not Apply';
    ebayItem.product.imageUrls = [];
    ebayItem.product.imageUrls.push("https://sc04.alicdn.com/kf/UTB8ou8hOyDEXKJk43Oqq6Az3XXaz.jpg");
    ebayItem.product.ean = [];
    ebayItem.product.upc = [];
    const ean = product.productCodes.find(c => c.codeType.toString() === 'BARCODEEAN8'
      || c.codeType.toString() === 'BARCODEEAN13');
    if (ean != null) {
      ebayItem.product.ean.push(ean.code);
      ebayItem.product.upc.push(ean.code);
    }


    if (withLocales) {
      ebayItem.sku = product.id.toString();
      // ebayItem.locale = 'it_IT';
      ebayItem.locale = 'en_US';
    }

    return ebayItem;
  }

  mapToEbayOffer(item: EbayInventoryItem, product: Product, ebayConfig, qte, startDate) {
    const ebayOffer = {
      sku: item.sku,
      // marketplaceId: 'EBAY_IT',
      marketplaceId: 'EBAY_US',
      format: 'FIXED_PRICE',
      listingDescription: item.product.description ? item.product.description : item.product.title,
      availableQuantity: qte,
      pricingSummary: {
        price: {
          value: product.inOffer ? product.priceOff : product.priceSale,
          // currency: 'EUR'
          currency: 'USD'
        }
      },
      listingPolicies: {
        paymentPolicyId: ebayConfig.paymentPolicyId,
        returnPolicyId: ebayConfig.returnPolicyId,
        fulfillmentPolicyId: ebayConfig.shippingPolicyId
      },
      // categoryId: '20641',
      categoryId: '30120',
      // categoryId: '79631',
      merchantLocationKey: ebayConfig.merchantLocationKey,
      tax: {
        applyTax: false
      },
      listingDuration: 'GTC',
      listingStartDate: startDate,
      includeCatalogProductDetails: true,
      hideBuyerDetails: false
    }
    if (product.inOffer) {
      ebayOffer.pricingSummary = {
        price: {
          value: product.priceOff,
          currency: 'USD'
        },
        // @ts-ignore
        originalRetailPrice: {
          value: product.priceSale,
          currency: 'USD'
        },
        pricingVisibility: 'PRE_CHECKOUT',
        originallySoldForRetailPriceOn: 'ON_EBAY'
      }
    }
    console.log('offer = ', ebayOffer);
    return ebayOffer;
  }

}
