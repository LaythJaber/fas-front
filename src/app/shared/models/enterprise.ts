import { ZipCode } from './zip-code';

export class Enterprise {
  id: number;
  companyName: string;
  uuid: string;
  vatNumber: string;
  fiscalCode: string;
  sdiCode: string;
  rea: string;
  address: string;
  street: string;
  zipCodeId: string;
  zipCode: ZipCode;
  phone: string;
  phonePrefix: string;
  mobile: string;
  mobilePrefix: string;
  fax: string;
  faxPrefix: string;
  email: string;
  contact: string;
  website: string;
  bank: string;
  branchBank: string;
  iban: string;
  cin: string;
  abi: string;
  cab: string;
  swift: string;
  note: string;
  business: {
    description: string,
    id: number
  };
}
