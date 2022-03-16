import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PluginConfiguration} from "../../models/plugin/plugin-configuration";
import {PluginRequest} from "../../models/plugin/plugin-request";

@Injectable({
  providedIn: 'root'
})
export class PluginConfigService {

  PLUGIN_CONFIG_API = environment.api + '/plugins-config';

  constructor(
    private http: HttpClient
  ) {}

  getPluginConfiguration() {
    return this.http.get<PluginConfiguration>(`${this.PLUGIN_CONFIG_API}`);
  }

  updateGoogleAnalyticsPlugin(request: PluginRequest) {
    return this.http.put(`${this.PLUGIN_CONFIG_API}/google-analytics`, request, {observe: "response"});
  }

  updateFacebookPixelPlugin(request: PluginRequest) {
    return this.http.put(`${this.PLUGIN_CONFIG_API}/facebook-pixel`, request, {observe: "response"});
  }

  updateTrustPilotPlugin(request: PluginRequest) {
    return this.http.put(`${this.PLUGIN_CONFIG_API}/trust-pilot`, request, {observe: "response"});
  }

  updateIubendaPlugin(request: PluginRequest) {
    return this.http.put(`${this.PLUGIN_CONFIG_API}/iubenda`, request, {observe: "response"});
  }

  updateFoodManagerConnector(request: PluginRequest) {
    return this.http.put(`${this.PLUGIN_CONFIG_API}/food-manager`, request, {observe: "response"});
  }

  updateSellPointConnector(request: PluginRequest) {
    return this.http.put(`${this.PLUGIN_CONFIG_API}/sell-point`, request, {observe: "response"});
  }

}
