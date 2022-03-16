export class PluginRequest {
  enabled?: boolean;
  id?: string;

  // for trustPilot
  templateId?:string;

  // for iubenda
  cookiesEnabled?: boolean;
  cookiesScript?: string;

  // for food manager
  foodManagerGenericCustomerEnabled?: boolean;
  foodManagerGenericCustomerCode?: string;


  // for sell point
  sellPointGenericCustomerEnabled?: boolean;
  sellPointGenericCustomerCode?: string;
  sellPointUsername?: string;
  sellPointPassword?: string;
  sellPointCompanyId?: number;
  sellPointEmployerId?: number;
  sellPointStoreId?: number;
  sellPointSeasonId?: number;

}
