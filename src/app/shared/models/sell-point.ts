import {ZipCode} from './zip-code';
import {Time} from '@angular/common';
import { Enterprise } from './enterprise';
import {TranslationRequest} from './translation-request';

export class SellPoint {
  id: number;
  name: string;
  uuid: string;
  address: string;
  street: string;
  zipCodeId: string;
  zipCode: ZipCode;
  phone: string;
  phonePrefix: string;
  mobile: string;
  mobilePrefix: string;
  email: string;
  contact: string;
  planningType: 'OPERATOR' | 'CABIN' | 'OPERATOR_AND_CABIN';
  startHour: string;
  finishHour: string;
  enterpriseId;
  enterprise: Enterprise;
  enterpriseName: string;
  note: string;
  capAss?: number[] = [];
  associatAllCaps = false;
  selected = false;
}
