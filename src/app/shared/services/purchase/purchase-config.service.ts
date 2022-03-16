import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PurchaseConfiguration} from "../../models/purchase/purchase-configuration";

@Injectable({
  providedIn: 'root'
})
export class PurchaseConfigService {

  PURCHASE_CONFIG_API = environment.api + '/purchases-config';

  constructor(
    private http: HttpClient
  ) {}

  getPurchaseConfiguration() {
    return this.http.get<PurchaseConfiguration>(`${this.PURCHASE_CONFIG_API}`);
  }

  updatePurchaseCancelTime(time: number) {
     return this.http.put(`${this.PURCHASE_CONFIG_API}/cancel-time`, time, {observe: "response"});
  }

  updatePurchaseConditionPage(conditionPageNumber: number) {
    return this.http.put(`${this.PURCHASE_CONFIG_API}/condition-page`, conditionPageNumber, {observe: "response"});
  }

}
