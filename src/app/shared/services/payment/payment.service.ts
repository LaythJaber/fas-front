import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Payment} from "../../models/payment/payment";
import {PaymentType} from "../../models/payment/payment-type";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  PAYMENT_API = environment.api + '/payments';

  constructor(
    private http: HttpClient
  ) {
  }

  getPaymentList() {
    return this.http.get<Payment[]>(`${this.PAYMENT_API}`);
  }

  getPaymentDetails(type: PaymentType) {
    return this.http.get<Payment>(`${this.PAYMENT_API}/details?type=${type}`);
  }

  updatePayment(payment: Payment) {
    return this.http.put<Payment>(`${this.PAYMENT_API}`, payment)
  }
}
