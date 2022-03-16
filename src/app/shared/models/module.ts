import {Qa} from "./Qa";
import {Language} from "../enum/language.enum";

export class Module {
  id?: number;
  name?: string;
  qas?: Qa[];
  createdAt?: Date;
  updatedAt?: Date;
  langEnum?: Language;
}
