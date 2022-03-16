import {Enterprise} from './enterprise';
import {ImportEnterpriseModel} from '../enum/import-enterprise-model';
import {ImportType} from '../enum/import-type';

export class ImportHistory {
  id: number;
  startedAt: Date;
  endedAt: Date;
  importedCount: number;
  finished: boolean;
  enterprise: Enterprise;
  importModel: ImportEnterpriseModel;
  importUrl: string;
  importType: ImportType;
  automaticImport: boolean;
  version: string;
  errorMsg: string;
  productCode: string;
}
