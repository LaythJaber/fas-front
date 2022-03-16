import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import {StompConfig, StompService} from '@stomp/ng2-stompjs';
import {FasHeaderModule} from "./components/header/fas-header.module";
import {FasSidebarModule} from "./components/sidebar/fas-sidebar.module";
import {FasFooterModule} from "./components/footer/fas-footer.module";
import {FasQuickSidebarModule} from "./components/quick-sidebar/fas-quick-sidebar.module";
import {FasSubheaderModule} from "./components/subheader/fas-subheader.module";
import {FasBreadcrumbModule} from "./components/breadcrumb/fas-breadcrumb.module";
import {stompConfig} from "../../../../../shared/config/stomp/rx-stomp.config";
import {FasLayoutComponent} from "./fas-layout.component";

@NgModule({
  imports: [
    RouterModule,
    FasHeaderModule,
    FasFooterModule,
    FasSidebarModule,
    FasBreadcrumbModule,
    FasQuickSidebarModule,
    FasSubheaderModule,
    CommonModule,
    MatButtonModule,
    TranslateModule,
  ],
  declarations: [
    FasLayoutComponent
  ],
  providers: [
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ]
})
export class FasLayoutModule {
}
