import {ReturnInstructionTranslation} from "./return-instruction-translation";
import {ReturnConditionTranslation} from "./return-condition-translation";

export class ReturnProductConfig {
  id: number;
  enabled: boolean;
  toleranceTime: number; // nombre de jours

  ivaEnabled: boolean;
  ivaToleranceTime: number; // nombre de jours

  attachment: boolean;

  instructionsInfo: ReturnInstructionTranslation[];
  conditionsInfo: ReturnConditionTranslation[];


  createdAt: string;
  updatedAt: string;
}
