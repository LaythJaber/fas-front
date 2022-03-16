import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {CartsConfigComponent} from "./carts-config.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatTabsModule} from "@angular/material/tabs";

const routes: Routes = [
  {path: '', component: CartsConfigComponent}
];

@NgModule({
  declarations: [
    CartsConfigComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatButtonModule,
        NgSelectModule,
        MatTabsModule,
    ]
})
export class CartsConfigModule { }
