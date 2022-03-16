import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../models/payment';
import { PaymentResponse } from '../models/payment-response';
import { Observable, of, Subject } from 'rxjs';
import { PaymentHistoryRequest } from '../dto/payment-history-request';
import { SearchResponse } from '../dto/search-response';
import { LazyRequest } from '../dto/lazy-request';
import { concatAll, delay, map } from 'rxjs/operators';
import { PaymentElementType } from '../enum/payment-element-type';
import { ClientPurchase } from '../models/client-purchase';
import { PaymentStatsDto } from '../dto/payment-stats-dto';



@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  PAYMENT_API = environment.api + '/payment';

  rtCmdSubject = new Subject();
  rtCmdObservable = this.rtCmdSubject.asObservable();

  constructor(private http: HttpClient) {
    this.rtCmdObservable.pipe(
      map(i => of(i).pipe(delay(2000))), concatAll()).subscribe((r: Observable<any>) => {
        r.subscribe(m => m());
      });
  }

  pay(payment: Payment): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.PAYMENT_API}/`, payment);
  }

  findAll() {
    return this.http.get<Payment[]>(`${this.PAYMENT_API}`);
  }

  paymentMode(request: any) {
    return this.http.post<string>(`${this.PAYMENT_API}/payment-mode`, request);
  }

  findById(id) {
    return this.http.get<Payment>(`${this.PAYMENT_API}/${id}`);
  }

  updateTicketDetails(request) {
    return this.http.post<string>(`${this.PAYMENT_API}/ticket-details`, request);
  }


  updateStatus(paymentHistoryRequest: PaymentHistoryRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.PAYMENT_API}/update-status`, paymentHistoryRequest);
  }

  getLazyPayments(request: PaymentLazyRequest) {
    return this.http.post<SearchResponse<Payment>>(`${this.PAYMENT_API}/filter`, request);

  }

  getPaymentHistoryByClientId(clientId: number) {
    return this.http.get<Date[]>(`${this.PAYMENT_API}/payment-history/${clientId}`);
  }

  checkIfClientIsNew(clientId: number) {
    return this.http.get<{ lastPassage: Date, new: boolean }>(`${this.PAYMENT_API}/is-client-new/${clientId}`);
  }

  getClientProductPurchase(request: PurchaseLazyRequest) {
    return this.http.post<ClientPurchase>(`${this.PAYMENT_API}/client-purchase`, request);
  }

  getScontrinoMedio() {
    return this.http.get<number>(`${this.PAYMENT_API}/scontrino-medio`);
  }

  paymentStats() {
    return this.http.get<PaymentStatsDto[]>(`${this.PAYMENT_API}/payment-stat`);
  }

  findByBookingId(id) {
    return this.http.get<Payment>(`${this.PAYMENT_API}/find-by-booking/${id}`);
  }

  deleteDark() {
    return this.http.delete(`${this.PAYMENT_API}/delete-dark-per-day`);
  }

  hasDark() {
    return this.http.get(`${this.PAYMENT_API}/has-dark-payment`);
  }

  salesWithoutDiscount(request: any) {
    return this.http.post<number>(`${this.PAYMENT_API}/sales-without-discount`, request);
  }

  discount(request: any) {
    return this.http.post<number>(`${this.PAYMENT_API}/discounts`, request);
  }

  paymentPerX(request: any) {
    return this.http.post<number>(`${this.PAYMENT_API}/payment-per-x`, request);
  }

}


class PaymentLazyRequest extends LazyRequest {

}

class PurchaseLazyRequest extends LazyRequest {
  clientId: number;
  type: PaymentElementType;
}
