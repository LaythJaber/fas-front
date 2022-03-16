import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule, MatButtonModule } from '@angular/material';
import {SharedModule} from "../../../../../../../shared/shared.module";
import {FasNavigationComponent} from "./fas-navigation.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    MatIconModule,
    MatButtonModule
  ],
    declarations: [FasNavigationComponent],
    exports: [FasNavigationComponent]
})
export class FasNavigationModule { }
