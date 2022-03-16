import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderComponent } from './provider.component';
import {RouterModule, Routes} from "@angular/router";
import {TagComponent} from "../tag/tag.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from "../../../../shared/shared.module";
import {TagFormModalComponent} from "../tag/tag-form-modal.component";
import { MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatPaginatorModule, MatDividerModule } from '@angular/material';
import { ProviderModalComponent } from './provider-modal.component';

const routes: Routes = [
  {path: '', component: ProviderComponent}
];


@NgModule({
  declarations: [ProviderComponent, ProviderModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    SharedModule.forChild(),
    MatDividerModule,
    NgbTypeaheadModule,
    MatProgressSpinnerModule,
    NgbTooltipModule,
    FormsModule
  ],
  entryComponents: [
    ProviderModalComponent
  ],
  exports: [ ProviderModalComponent ]
})
export class ProviderModule { }
