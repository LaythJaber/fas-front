import {Language} from "../language";
import {ReturnInstructionAttachment} from "./return-instruction-attachment";

export class ReturnInstructionTranslation {
  id: number;
  instructions: string;
  attachments: ReturnInstructionAttachment[];
  language: Language;
}

