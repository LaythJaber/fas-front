import {PaymentType} from './payment-type';
import {Group} from './group';

export class Company {
  id?: number;
  uuid?: string;
  businessName: string;
  vatNumber: string;
  fiscalCode: string;
  codeSDI: string;
  // rea?: string;
  emailPEC?: string;
 /* registeredOfficeAddress: string;
  registeredOfficeStreetNumber: string;
  registeredOfficeNation: string;
  registeredOfficePostalCode: string;
  registeredOfficeLocation: string;
  registeredOfficeProvince: string;

  operatingOfficeAddress?: string;
  operatingOfficeStreetNumber?: string;
  operatingOfficeNation?: string;
  operatingOfficePostalCode?: string;
  operatingOfficeLocation?: string;
  operatingOfficeProvince?: string;*/

  registeredOfficeAddress?: string;
  registeredOfficeStreet?: string;
  registeredOfficeZipCode?: {
    id: number;
    province: number;
    city: number;
    country: number;
  };

  operatingOfficeAddress?: string;
  operatingOfficeStreet?: string;
  operatingOfficeZipCode?: {
    id: number;
    province: number;
    city: number;
    country: number;
  };

  phone?: string;
  phonePrefix?: string;
  mobile?: string;
  mobilePrefix?: string;
  // fax?: string;
  // faxPrefix?: string;
  email?: string;
  referent?: string;
  website?: string;
  // bank?: string;
  bankBranch?: string;
  iban?: string;
  // cin?: string;
  // bicSwift?: string;
  // abi?: string;
  // cab?: string;
  note?: string;
  active?: boolean;
  visible?: boolean;
  paymentId?: number;
  payment?: PaymentType;
  groupId?: number;
  group?: Group;
  creationAt?: Date;
  updatedAt?: Date;
  seq?: number;
}
