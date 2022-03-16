import {Role} from './role';

export class Operator {
  id: number;
  uuid: string;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
  roleId: number;
  dateOfBirth: string;
  password: string;
  fiscalCode: string;
  barCode: string;
  mobile: string;
  mobilePrefix: string;
  email?: string;
  address: string;
  street: string;
  city: string;
  zipCode?: {
    id: number;
    province: number;
    city: number;
    country: number;
  };
  sellPointId: number;
  visible: boolean;
  seq: number;
}
