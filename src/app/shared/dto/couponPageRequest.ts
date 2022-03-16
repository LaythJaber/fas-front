import {LazyRequest} from './lazy-request';
import {CouponType} from '../enum/coupon-type';
import {CouponConditionType} from '../enum/couponCondition-Type';
import {PromotionType} from '../enum/promotion-type';
import {DiscountType} from '../enum/discount-type';

export class CouponPageRequest extends LazyRequest {
  dateFrom: string ;
  dateTo: string;
  couponType: CouponType;
  couponConditionType: CouponConditionType;
  promotionType: PromotionType;
  discountType: DiscountType;
}
