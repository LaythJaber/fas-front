import {Language} from "../enum/language.enum";

export class Qa {
  id?: number;
  question?: string;
  answer?: string;
  moduleId?: number;
  langEnum?: Language;
  createdAt ?: Date;
  updatedAt?: Date;
}
