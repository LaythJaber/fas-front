import {Language} from "../language";

export class AppMobileConfiguration {
  id: number;
  androidVersionNumber: string;
  androidObligatory: boolean;
  iosVersionNumber: string;
  iosObligatory: boolean;
  transInfo: AppMobileConfigurationTranslation[];
}

export class AppMobileConfigurationTranslation {
  id: number;
  description: string;
  titleOblig: string;
  descriptionOblig: string;
  titleFacultatif: string;
  descriptionFacultatif: string;
  language: Language;
}
