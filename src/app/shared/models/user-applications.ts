import {Account} from "./account.model";
import {Application} from "./application.model";

export class UserApplications {

  account: Account;

  application: Application;

  status: string;

  note: string;

  editNote: boolean = false;
}
