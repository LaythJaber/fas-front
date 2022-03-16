import { PriceRecoveryCriteria } from '../enum/price-recovery-criteria.enum';
import { RechargeRecoveryCriteria } from '../enum/recharge-recovery-criteria.enum';
import {Account} from './account.model';

export class Group {
  id?: number;
  uuid?: string;
  name: string;
  description: string;
  active: boolean;
  startDate: Date;
  expirationDate: Date;
  expired: boolean;
  features?: string[];
  createdAt?: Date;
  updateAt?: Date;
  confirmed: boolean;
  rechargeCriteria?: RechargeRecoveryCriteria;
  priceCriteria?: PriceRecoveryCriteria;
  customRecharge?: number;
}
export class GroupWithSuperAdmins extends Group {
  superAdmins: Account[];
}
