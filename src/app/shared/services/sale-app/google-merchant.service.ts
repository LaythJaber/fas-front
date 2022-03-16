import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {GoogleProduct} from "../../models/sale-app/google/google-product";
import {Product} from "../../models/product";
import {GoogleProductPrice} from "../../models/sale-app/google/google-product-price";
import {HttpClient} from "@angular/common/http";
import {LocalTranslate} from "../../pipes/local-translate";
import {LazyRequest} from "../../dto/lazy-request";
import {SearchResponse} from "../../dto/search-response";

@Injectable({
  providedIn: 'root',
})
export class GoogleMerchantService {

  GOOGLE_PRODUCTS_API = environment.hubSellerApi + '/google/products';
  GOOGLE_CONFIG_API = environment.hubSellerApi + '/google/config';
  SALE_APP_API = environment.api + '/sale-app'

  constructor(
    private http: HttpClient,
    private localTranslate: LocalTranslate
  ) {
  }

  getGoogleConfig(merchantId: string) {
    return this.http.get<any>(`${this.GOOGLE_CONFIG_API}/${merchantId}`);
  }

  getProductList(merchantId: string, request: ProductGMRequest) {
    const headers = {
      'X-TENANT-ID': 'sc-google-'+merchantId
    };
    return this.http.post<SearchResponse<GoogleProduct>>(`${this.GOOGLE_PRODUCTS_API}/filter`, request,{headers});
  }

  synchronizeGoogleTO(userId: string) {
    const headers = {
      'userId': userId
    };
    return this.http.get<any>(`${this.GOOGLE_CONFIG_API}/synchronize`,{headers});
  }


  /** Add  functions ****/

  addProduct(userId: string, googleProduct: GoogleProduct) {
    const headers = {
      'userId': userId
    };
    return this.http.post<any>(`${this.GOOGLE_PRODUCTS_API}/add-one`, googleProduct,  {headers});
  }

  addSelectedProductList(userId: string, saleAppProductList: GoogleProduct[]) {
    const headers = {
      'userId': userId
    };
    return this.http.post<any>(`${this.GOOGLE_PRODUCTS_API}/add-list`, saleAppProductList,  {headers});
  }

  /** via backoffice to get all the filtered products ***/
  addFilteredProductList(request) {
    return this.http.post<any>(`${this.SALE_APP_API}/google-merchant/add-list`, request, {observe: "response"});
  }



  /**** Delete functions ***/

  deleteProduct(userId: string, productId: string) {
    const headers = {
      'userId': userId
    };
    return this.http.delete<any>(`${this.GOOGLE_PRODUCTS_API}/delete-one/${productId}`, {headers});
  }

  deleteProductList(userId: string, productIds: string[]) {
    const headers = {
      'userId': userId
    };
    return this.http.post<any>(`${this.GOOGLE_PRODUCTS_API}/delete-list`, productIds, {headers});
  }

  deleteAllProduct(userId: string) {
    const headers = {
      'userId': userId
    };
    return this.http.delete<any>(`${this.GOOGLE_PRODUCTS_API}/delete-all`, {headers});
  }



  /**** mapping ****/

  mapProductToSaleAppProduct(product: Product, domain, availability?, availabilityDate?, expirationDate?, sellOnGoogleQuantity?): GoogleProduct {
    const saleAppProduct: GoogleProduct = new GoogleProduct();

    // identifier
    saleAppProduct.channel = 'online';
    saleAppProduct.contentLanguage = 'it';
    saleAppProduct.targetCountry = 'IT';
    saleAppProduct.offerId = product.id.toString();
    const ean = product.productCodes.find(c => c.codeType.toString() === 'BARCODEEAN8' || c.codeType.toString() === 'BARCODEEAN13');
    saleAppProduct.gtin =  ean ? ean.code : '';

    // description
    saleAppProduct.title = this.localTranslate.transform(product, "commercialDescription");
    saleAppProduct.description = this.localTranslate.transform(product, "note");

    // prices
    saleAppProduct.price = new GoogleProductPrice();
    saleAppProduct.price.value = product.priceSale.toString();
    saleAppProduct.price.currency = 'EUR';
    saleAppProduct.salePrice = new GoogleProductPrice();
    saleAppProduct.salePrice.value = product.inOffer ? product.priceOff.toString() : product.priceSale.toString();
    saleAppProduct.salePrice.currency = 'EUR';
    saleAppProduct.salePriceEffectiveDate = product.inOffer ?
      (product.dateStartOff + '/' + product.dateEndOff)
      : '';

    // links
    saleAppProduct.link = domain +  "/it/product/" + this.getFriendlyName(saleAppProduct.title) + '/' + product.id;
    saleAppProduct.imageLink = "https://sc04.alicdn.com/kf/UTB8ou8hOyDEXKJk43Oqq6Az3XXaz.jpg";
    saleAppProduct.additionalImageLinks = [];

    // availability
    saleAppProduct.availability = availability ? availability : (product.stock > 0 ? 'in stock' : 'out of stock');
    saleAppProduct.availabilityDate = availabilityDate;
    saleAppProduct.expirationDate = expirationDate;
    saleAppProduct.sellOnGoogleQuantity = sellOnGoogleQuantity;

    // caracteristics
    saleAppProduct.brand = product.brand ? product.brand.description : '';
    saleAppProduct.color = '';
    saleAppProduct.condition = '';
    saleAppProduct.gender = '';
    saleAppProduct.googleProductCategory = '';
    saleAppProduct.adult = false;
    saleAppProduct.ageGroup = '';

    // ads
    saleAppProduct.adsGrouping = '';
    saleAppProduct.adsLabels = [];
    saleAppProduct.displayAdsId = '';
    saleAppProduct.displayAdsLink = '';
    saleAppProduct.displayAdsSimilarIds = [];
    saleAppProduct.displayAdsTitle = '';
    saleAppProduct.displayAdsValue = 0;

    return saleAppProduct;
  }

  updateSaleAppProduct(product: GoogleProduct, availability, availabilityDate, expirationDate, sellOnGoogleQuantity) {
    product.availability = availability;
    product.availabilityDate = availabilityDate;
    product.expirationDate = expirationDate;
    product.sellOnGoogleQuantity = sellOnGoogleQuantity;
    return product;
  }

  getFriendlyName(name: string): string {
    return name.toLowerCase().trim().split(' ').join('-');
  }

}

export class ProductGMRequest extends LazyRequest{
  availability: string = '';
  expirationDate: string = '';
  status: string = '';
}
