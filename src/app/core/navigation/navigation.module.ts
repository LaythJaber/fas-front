import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from './navigation.component';
import {SharedModule} from '../../shared/shared.module';
import { MatIconModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SharedModule,
    MatIconModule,
    MatButtonModule
  ],
    declarations: [NavigationComponent],
    exports: [NavigationComponent]
})
export class NavigationModule { }
