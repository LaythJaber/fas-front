import {SmsStatus} from '../enum/sms-status';
import {statusDetail} from '../enum/status-detail.enum';

export class PromoClient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  fiscalCode: string;
  gender: string;
  mobile: string;
  mobilePrefix: string;
  email: string;
  smsSendAt: Date;
  mailSendAt: Date;
  mailStatus: SmsStatus;
  mailError: string;
}
