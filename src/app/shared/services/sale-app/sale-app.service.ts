import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SaleApp} from "../../models/sale-app/sale-app";
import {SaleAppRequest} from "../../models/sale-app/sale-app-request";

@Injectable({
  providedIn: 'root',
})
export class SaleAppService {

  SALE_APP_API = environment.api + '/sale-app'
  GOOGLE_CONFIG_API = environment.hubSellerApi + '/google/config';
  EBAY_CONFIG_API = environment.hubSellerApi + '/ebay/config';
  AMAZON_CONFIG_API = environment.hubSellerApi + '/amazon/config';


  constructor(
    private http: HttpClient,
  ) {
  }

  getSaleApp() {
    return this.http.get<SaleApp>(`${this.SALE_APP_API}`);
  }


  // google
  getGoogleConfig(merchantId: string) {
    return this.http.get(`${this.GOOGLE_CONFIG_API}/${merchantId}`);
  }

  updateGoogleMerchant(request: SaleAppRequest) {
    return this.http.put(`${this.SALE_APP_API}/google-merchant`, request, {observe: "response"});
  }

  updateGoogleMerchantFiles(request: FormData) {
    return this.http.post<any>(`${this.GOOGLE_CONFIG_API}`, request);
  }



  // ebay
  getEbayConfig(uuid: string) {
    return this.http.get(`${this.EBAY_CONFIG_API}/${uuid}`);
  }

  updateEbay(request: SaleAppRequest) {
    return this.http.put(`${this.SALE_APP_API}/ebay`, request, {observe: "response"});
  }

  updateEbayConfig(request: FormData) {
    return this.http.post(`${this.EBAY_CONFIG_API}`, request);
  }

  getEbayAuthUri(fileName: string) {
    return this.http.get<any>(`${this.EBAY_CONFIG_API}/auth-uri?file=${fileName}`);
  }

  updateEbayTokens(uuid: string, authCode: string) {
    const headers = {'UUID': uuid};
    return this.http.post(`${this.EBAY_CONFIG_API}/tokens`, authCode, {headers});
  }

  // amazon
  getAmazonConfig(uuid: string) {
    return this.http.get(`${this.AMAZON_CONFIG_API}/${uuid}`);
  }

  updateAmazon(request: SaleAppRequest) {
    return this.http.put(`${this.SALE_APP_API}/amazon`, request, {observe: "response"});
  }

  updateAmazonConfig(request) {
    return this.http.post(`${this.AMAZON_CONFIG_API}`, request);
  }

}

