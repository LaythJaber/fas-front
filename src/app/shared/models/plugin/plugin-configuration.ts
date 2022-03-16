export class PluginConfiguration {
  id: number;
  createdAt: string;
  updatedAt: string;

  googleAnalyticsEnabled: boolean;
  googleAnalyticId: string;

  facebookPixelEnabled: boolean;
  facebookPixelId: string;

  trustPilotEnabled: boolean;
  trustPilotBusinessUnitId: string;
  trustPilotTemplateId: string;

  iubendaId: string;
  iubendaPrivacyEnabled: boolean;
  iubendaCookiesEnabled: boolean;
  iubendaCookiesScript: string;

  // foodManager connector attributes
  foodManagerEnabled: boolean;
  foodManagerUrl: string;
  foodManagerGenericCustomerEnabled: boolean;
  foodManagerGenericCustomerCode: string;


  // sellPoint connector attributes
  sellPointEnabled: boolean;
  sellPointUrl: string;
  sellPointGenericCustomerEnabled: boolean;
  sellPointGenericCustomerCode: string;
  sellPointUsername: string;
  sellPointCompanyId: number;
  sellPointEmployerId: number;
  sellPointStoreId: number;
  sellPointSeasonId: number;

}
