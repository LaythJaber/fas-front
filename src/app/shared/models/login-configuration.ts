export interface LoginConfiguration {
  id: number;
  loginWithFacebook: boolean;
  loginWithGoogle: boolean;
  loginRequired: boolean;
  registrationConfirmationType: 'MANUAL' | 'AUTO';
  pricesVisibleByAnonymous: boolean;
  customField1Name: string;
  activeCustomField1: boolean;
  requiredCustomField1: boolean;
  customField2Name: string;
  activeCustomField2: boolean;
  requiredCustomField2: boolean;
  customField3Name: string;
  activeCustomField3: boolean;
  requiredCustomField3: boolean;
  customField4Name: string;
  activeCustomField4: boolean;
  requiredCustomField4: boolean;
}
