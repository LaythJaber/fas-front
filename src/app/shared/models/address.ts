import { ZipCode } from './zip-code';

export class Address {
    addressId: number ;
    enabled: boolean ;
    name: string;
    surname: string;
    mobile: string;
    mobilePrefix: string;
    streetNumber: string;
    elevator: boolean ;
    notes: string;
    floor: number;
    apartment: string;
    nation: string;
    shippingAddress: string;
    intercom: string;

    address: string ;
    codeDestination: string ;
    fiscalCode: string;
    pec: string;
    iva: string;

    zipCode: ZipCode;
    isMain: boolean;
}




