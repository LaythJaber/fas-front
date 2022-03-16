import {PromoStatus} from '../enum/promo-status';
import {PromoClient} from './promo-client';
import {PromoType} from '../enum/promo-type';

export class Promotion {
  id?: number;
  uuid?: string;
  seq?: string;
  createdAt?: string;
  type?: PromoType;
  object?: string;
  message?: string;
  sendAt?: string;
  clientsId?: number[];
  promoModelId?: number;
  status?: PromoStatus;
  promoClients?: PromoClient[];
  shareFacebook: boolean;
  shareInstagram: boolean;
  template: string;
  design: string;
  postText: string;
  postImageUrl: string;
}
