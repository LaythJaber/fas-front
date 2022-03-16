import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {HeaderModule} from './components/header/header.module';
import {SidebarModule} from './components/sidebar/sidebar.module';
import {FooterModule} from './components/footer/footer.module';
import {SubheaderModule} from './components/subheader/subheader.module';
import {QuickSidebarModule} from './components/quick-sidebar/quick-sidebar.module';
import {BreadcrumbModule} from './components/breadcrumb/breadcrumb.module';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import {StompConfig, StompService} from '@stomp/ng2-stompjs';
import {stompConfig} from '../../shared/config/stomp/rx-stomp.config';

@NgModule({
  imports: [
    RouterModule,
    HeaderModule,
    FooterModule,
    SidebarModule,
    BreadcrumbModule,
    QuickSidebarModule,
    SubheaderModule,
    CommonModule,
    MatButtonModule,
    TranslateModule,
  ],
  declarations: [
    LayoutComponent,
  ],
  providers: [
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ]
})
export class LayoutModule {
}
