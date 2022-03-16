import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgetPasswordComponent} from './forget-password.component';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

const routes: Routes = [
  {path: '', component: ForgetPasswordComponent}
];

@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardModule
  ]
})
export class ForgetPasswordModule { }
