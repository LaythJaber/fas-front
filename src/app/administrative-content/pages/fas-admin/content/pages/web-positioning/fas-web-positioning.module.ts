import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {ReactiveFormsModule} from "@angular/forms";
import {WebPositioningComponent} from "./web-positioning.component";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDividerModule} from "@angular/material/divider";
import {LanguageResolverService} from "../../../../../../shared/services/language-resolver.service";

const routes: Routes = [
  {
    path: ':page', component: WebPositioningComponent, resolve: {langs: LanguageResolverService},
  }
];

@NgModule({
  declarations: [WebPositioningComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTabsModule,
    MatDividerModule,
  ]
})
export class FasWebPositioningModule {
}
