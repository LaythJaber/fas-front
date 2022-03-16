import {ImportEnterpriseModel, ProductToImport} from '../enum/import-enterprise-model';
import {Time} from '@angular/common';
import {FormControl} from '@angular/forms';

export class ImportEnterpriseConfig {
  deactivate: boolean;
  id: number;
  ipServer: string;
  port: number;
  isHTTPS: boolean;
  model: ImportEnterpriseModel;
  enterpriseId: number;
  importPerDay: number;
  hours: string[];
  username: string;
  password: string;
  mobilePrefix: string;
  sentSmsAt: string;
  mobile: string;
  email: string;
  notificationMail: boolean;
  notificationSms: boolean;
  importedPriceListId: number;
  productToImport: ProductToImport;
}
