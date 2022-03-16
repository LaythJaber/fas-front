import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AmazonProductPageRequest} from "../../models/sale-app/amazon/amazon-product-page-request";
import {SearchResponse} from "../../dto/search-response";
import {AmazonProduct} from "../../models/sale-app/amazon/amazon-product";

@Injectable({
  providedIn: 'root',
})
export class AmazonService {

  SALE_APP_API = environment.api + '/sale-app'
  AMAZON_CONFIG_API = environment.hubSellerApi + '/amazon/config';
  AMAZON_PRODUCTS_API = environment.hubSellerApi + '/amazon/products';

  constructor(
    private http: HttpClient,
  ) {
  }

  getProducts(uuid: string, request: AmazonProductPageRequest) {
    const headers = {
      'X-TENANT-ID': 'sc-amazon-'+uuid
    };
    return this.http.post<SearchResponse<AmazonProduct>>(`${this.AMAZON_PRODUCTS_API}/filter`, request,{headers});
  }

  synchronizeAmazon(uuid: string) {
    const headers = {'UUID': uuid};
    return this.http.get<any>(`${this.AMAZON_CONFIG_API}/synchronize`,{headers});
  }

  addProduct(uuid: string, request) {
    const headers = {'UUID': uuid};
    return this.http.post(`${this.AMAZON_PRODUCTS_API}/add-one-with-catalog`, request,{headers});
  }

  deleteProduct(uuid: string, sku: string) {
    const headers = {'UUID': uuid};
    console.log("send request delete = ", uuid, sku);
    return this.http.delete(`${this.AMAZON_PRODUCTS_API}/delete-one/${sku}`,{headers});
  }

}
