import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SiteInfo} from "../../models/siteinfo/site-info";

@Injectable({
  providedIn: 'root'
})
export class SiteInfoService {

  SITE_INFO_API = environment.api + '/site-info';

  constructor(
    private http: HttpClient
  ) {
  }

  getSiteInfoDetails() {
    return this.http.get<SiteInfo>(`${this.SITE_INFO_API}`);
  }

  updateSiteInfo(siteInfo: SiteInfo) {
    return this.http.put(`${this.SITE_INFO_API}/`, siteInfo, {observe: "response"});
  }

}
