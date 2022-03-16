import {CouponType} from '../enum/coupon-type';
import {PromotionType} from '../enum/promotion-type';
import {CouponConditionType} from '../enum/couponCondition-Type';
import {Product} from './product';
import {AuditSection} from './audit-section';
import {DiscountType} from '../enum/discount-type';
import {Category} from './category';
import {Enterprise} from './enterprise';
import {CouponClient} from '../dto/couponClient';

export class Coupon {

  couponId?: number;
  description?: string;
  code?: string;
  discount?: number;
  minProductQuantity?: number;
  minAmountOrder?: number;
  promo?: boolean;
  dateFrom?: string;
  dateTo?: string;
  maxNumberUse?: number;
  actualNumberUse?: number;
  auditSection?: AuditSection;
  couponType?: CouponType;
  couponConditionType?: CouponConditionType;
  promotionType?: PromotionType;
  discountType?: DiscountType;
  products?: Product[];
  clients?: CouponClient[];
  categories?: Category[];
  enterprise?: Enterprise;
}
