import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatStepperModule} from "@angular/material/stepper";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {SharedModule} from "../../../../../../shared/shared.module";
import {FasUsersComponent} from "./fas-users.component";
import { FasUserDetailComponent } from './fas-user-detail/fas-user-detail.component';
import {NgbModalModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import { DocumentsTabComponent } from './fas-user-detail/tabs/documents-tab/documents-tab.component';
import { DsTabComponent } from './fas-user-detail/tabs/ds-tab/ds-tab.component';
import { ApplicationsTabComponent } from './fas-user-detail/tabs/applications-tab/applications-tab.component';
import { AssignApplicationDialogComponent } from './fas-user-detail/tabs/applications-tab/assign-application-dialog/assign-application-dialog.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { CreateMeetDialogComponent } from './fas-user-detail/create-meet-dialog/create-meet-dialog.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatDatepickerModule} from "@angular/material/datepicker";


const routes: Routes = [
  {
    path: '',
    component: FasUsersComponent,
  },
      {
        path: 'details/:id',
        component: FasUserDetailComponent
      }

];


@NgModule({
  declarations: [FasUsersComponent, FasUserDetailComponent, DocumentsTabComponent, DsTabComponent, ApplicationsTabComponent, AssignApplicationDialogComponent, CreateMeetDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    TranslateModule,
    NgbModalModule,
    NgbTooltipModule,
    FormsModule,
    MatTooltipModule,
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule
  ],
  entryComponents: [AssignApplicationDialogComponent,CreateMeetDialogComponent]

})
export class FasUsersModule { }
