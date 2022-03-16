import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ProductResource} from "../../models/product/product-resource";
@Injectable({
  providedIn: 'root'
})
export class ProductResourceService {

  PRODUCT_RESOURCE_API = environment.api + '/product-resources';
  PRODUCT_API = environment.publicApi + '/products';

  constructor(
    private http: HttpClient
  ) {
  }

  uploadProductResources(request: FormData) {
    return this.http.post(`${this.PRODUCT_RESOURCE_API}/upload`, request);
  }

  setMainImage(productId: number, url: string) {
    return this.http.put(`${this.PRODUCT_RESOURCE_API}/main-image/${productId}`, url, {observe: "response"});
  }


  unsetMainImage(productId: number) {
    return this.http.get(`${this.PRODUCT_RESOURCE_API}/unset-main-image/${productId}`);
  }

  deleteImage(productId: number, name: string) {
    return this.http.put(`${this.PRODUCT_RESOURCE_API}/delete-image/${productId}`, name, {observe: "response"});
  }

  getProductResources(productId: number, type: string) {
    return this.http.get<ProductResource[]>(`${this.PRODUCT_API}/images/${productId}?type=${type}`);
  }

}
