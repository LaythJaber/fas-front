import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ProductWeightConfiguration} from "../../models/product/product-weight-configuration";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductWeightConfigurationService {

  PRODUCT_WEIGHT_CONFIG_API = environment.api + '/product-weight-config';
  public productWeightConfiguration$: BehaviorSubject<ProductWeightConfiguration> = new BehaviorSubject<ProductWeightConfiguration>(null);

  constructor(
    private http: HttpClient
  ) {
    this.getProductWeightConfigurationDetails().then();
  }

  getProductWeightConfigurationDetails() {
    return this.http.get<ProductWeightConfiguration>(`${this.PRODUCT_WEIGHT_CONFIG_API}`).pipe(map(config => {
      this.productWeightConfiguration$.next(config);
    })).toPromise();
  }

  updateProductWeightConfiguration(request: ProductWeightConfiguration) {
    return this.http.put(`${this.PRODUCT_WEIGHT_CONFIG_API}/`, request, {observe: "response"});
  }
/*
  getProductWeightConfigurationDetails() {
    return this.http.get<ProductWeightConfiguration>(`${this.PRODUCT_WEIGHT_CONFIG_API}/client`)
        .pipe(map(config => {
          this.productWeightConfiguration$.next(config);
        })).toPromise();
  }*/

}
