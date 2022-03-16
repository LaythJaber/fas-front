import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule, MatButtonModule } from '@angular/material';
import {OwnerNavigationComponent} from './owner-navigation.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule
  ],
    declarations: [OwnerNavigationComponent],
    exports: [OwnerNavigationComponent]
})
export class OwnerNavigationModule { }
