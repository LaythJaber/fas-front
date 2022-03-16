import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ClientPageRequest} from '../dto/client-page-request';
import {SearchResponse} from '../dto/search-response';
import {Client} from '../models/client';
import {CouponPageRequest} from '../dto/couponPageRequest';
import {Observable} from 'rxjs';
import {Coupon} from '../models/coupon';
import {Product} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  COUPON_API = environment.api + '/coupons';

  constructor(private http: HttpClient) {}

  getCoupons(request: CouponPageRequest) {
    return this.http.post<SearchResponse<Coupon>>( this.COUPON_API + '/coupon-list', request);
  }

  addCoupon(coupon) {
     return this.http.post(this.COUPON_API + '/create', coupon, {observe: 'response'});
   }

  editCoupon(request: Coupon) {
    return this.http.put<Coupon>(this.COUPON_API + '/coupon', request);
  }

  deleteCoupon(couponId: number) {
    return this.http.delete(`${this.COUPON_API}/delete/${couponId}`, {observe: 'response'});
  }



 }
