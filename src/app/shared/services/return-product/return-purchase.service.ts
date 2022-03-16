import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../../dto/search-response";
import {ReturnPurchase} from "../../models/return-product/return-purchase";
import {ReturnPurchasePageRequest} from "../../models/return-product/return-purchase-page-request";

@Injectable({
  providedIn: 'root'
})
export class ReturnPurchaseService {
  RETURN_PURCHASE_API = environment.api + '/return-purchases';

  constructor(
    private http: HttpClient
  ) {
  }

  getFilteredReturnPurchases(request: ReturnPurchasePageRequest) {
    return this.http.post<SearchResponse<ReturnPurchase>>(`${this.RETURN_PURCHASE_API}/filter`, request);
  }

  getReturnPurchaseDetails(returnPurchaseId: number) {
    return this.http.get<ReturnPurchase>(`${this.RETURN_PURCHASE_API}/details/${returnPurchaseId}`);
  }

  changeReturnProductState(request: FormData) {
    return this.http.put(`${this.RETURN_PURCHASE_API}/return-product/status`, request);
  }

  changeReturnPurchaseState(returnPurchaseId: number) {
    return this.http.put<any>(`${this.RETURN_PURCHASE_API}/close`, returnPurchaseId,
      {observe: "response"});
  }


}
