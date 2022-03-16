import {PaymentElementType} from '../enum/payment-element-type';
import {PaymentModeObject} from './payment-mode-object';
import {PaymentMode} from '../enum/payment-mode';

export class PaymentEntry {
  type?: PaymentElementType;
  id?: number;
  description?: string;
  operatorId?: number;
  cabinId?: number;
  paymentMode?: number;
  unitPricing?: number;
  discount?: number;
  discountMode?: string;
  quantity?: number;
  totalDiscount?: number;
  total?: number;
  totalDiscounted?: number;
  fidelityCardId?: number;
  reloadCardId?: number;
  withoutReload?: number;
  point?: number;
  alternativePayment?: PaymentModeObject[];
  paymentMethod?: PaymentModeObject;
  initialSubscription?: PaymentMode;
  enableDiscount: boolean;
}
