import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../../dto/search-response";
import {Purchase} from "../../models/purchase/purchase";
import {PurchasePageRequest} from "../../models/purchase/purchase-page-request";
import {ChangePurchaseStateRequest} from "../../models/purchase/change-purchase-state-request";
import {CartRequest} from "../../dto/cart-request";

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  PURCHASE_API = environment.api + '/purchases';

  constructor(
    private http: HttpClient
  ) {
  }

  getLazyPurchases(request: PurchasePageRequest) {
    return this.http.post<SearchResponse<Purchase>>(`${this.PURCHASE_API}/filter`, request);
  }

  getPurchaseDetails(purchaseId: number) {
    return this.http.get<Purchase>(`${this.PURCHASE_API}/details/${purchaseId}`);
  }

  changePurchaseState(request: ChangePurchaseStateRequest) {
    return this.http.put(`${this.PURCHASE_API}/status`, request);
  }

  changeDeliveredQuantity(request: any) {
    return this.http.put(`${this.PURCHASE_API}/change-delivered-quantity`, request, {observe: "response"});
  }

  resendPurchaseToFoodManager(purchaseId: number) {
    return this.http.post(`${this.PURCHASE_API}/resend-food-manager`, purchaseId, {observe: "response"});
  }

  resendPurchaseToSellPoint(purchaseId: number) {
    return this.http.post(`${this.PURCHASE_API}/resend-sell-point`, purchaseId, {observe: "response"});
  }

  uploadBillingFile(purchaseId: number, billingFile: FormData) {
    return this.http.post(`${this.PURCHASE_API}/billing-file/${purchaseId}`, billingFile, {observe: "response"});
  }

  removeBillingFile(purchaseId: number) {
    return this.http.delete(`${this.PURCHASE_API}/billing-file/${purchaseId}`, {observe: "response"});
  }

  generatePickingListFile(purchaseId: number, type: 'RECEIPT' | 'PICKING') {
    return this.http.get(`${this.PURCHASE_API}/picking-list-file/${purchaseId}?type=${type}`, {responseType: "blob"});
  }

  removePickingListFile(purchaseId: number, type: 'RECEIPT' | 'PICKING') {
    return this.http.delete(`${this.PURCHASE_API}/picking-list-file/${purchaseId}?type=${type}`, {observe: "response"});
  }

  addProductToPurchase(purchaseId: number, request: CartRequest) {
    return this.http.post(`${this.PURCHASE_API}/add-product/${purchaseId}`, request);
  }

  removeProductFromPurchase(purchaseId: number, rowId: number) {
    return this.http.delete(`${this.PURCHASE_API}/remove-product/${purchaseId}?rowId=${rowId}`);
  }


}
