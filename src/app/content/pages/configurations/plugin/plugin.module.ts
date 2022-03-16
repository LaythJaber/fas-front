import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginComponent } from './plugin.component';
import {RouterModule, Routes} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { SaleAppComponent } from './components/sale-app/sale-app.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";

const routes: Routes = [
  {
    path: '', component: PluginComponent
  }
];

@NgModule({
  declarations: [
    PluginComponent,
    SaleAppComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatTabsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
    ]
})
export class PluginModule { }
