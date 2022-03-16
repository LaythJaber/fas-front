import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationComponent } from './authentication.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { BarcodeAuthenticationComponent } from './barcode-authentication/barcode-authentication.component';
import {MatIconModule} from '@angular/material/icon';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatDialogModule} from '@angular/material';
import { RegisterComponent } from './register/register.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FlexModule} from "@angular/flex-layout";
import {MatInputModule} from "@angular/material/input";

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  declarations: [AuthenticationComponent, BarcodeAuthenticationComponent, RegisterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    NgbCarouselModule,
    TranslateModule,
    MatSnackBarModule,
    MatIconModule,
    NgSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FlexModule,
    MatInputModule
  ],
  entryComponents: [
    BarcodeAuthenticationComponent
  ]
})
export class AuthenticationModule { }
