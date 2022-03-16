import {Gender} from './gender';
import {OrderType} from '../enum/order-type';
import {RegisterSource} from '../enum/register-source';
import {Address} from './address';
import {CancelledOperator} from '../enum/cancelled-operator';

export class Client {

  clientId?: number;
  sequence?: number;
  code?: string;

  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;

  email?: string;
  password?: string;

  mobile?: string;
  mobilePrefix?: string;
  home?: string;
  homePrefix?: string;

  fiscalCode?: string;
  orderType?: OrderType;
  registerSource?: RegisterSource;
  nationality?: string;

  mainAddress?: Address;

  // Payment
  stripeId?: string;

  // Legal acceptances
  newsletters?: boolean;
  marketing?: boolean;
  privacy?: boolean;

  blocked?: boolean;
  confirmed?: boolean;
  cancelled?: boolean;

  createdAt?: string;
  confirmedAt?: string;
  updatedAt?: string;
  loggedInAt?: string;
  cancelledAt?: string;
  cancelledBy?: CancelledOperator;

  note?: string;

  // for custom filed part
  customField1Value: string;
  customField2Value: string;
  customField3Value: string;
  customField4Value: string;
}


