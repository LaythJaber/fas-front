import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag.component';
import { NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule, MatDividerModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagFormModalComponent } from './tag-form-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import {MatIconModule} from "@angular/material/icon";


const routes: Routes = [
  {path: '', component: TagComponent}
];

@NgModule({
  declarations: [TagComponent, TagFormModalComponent],
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
        FormsModule,
        MatIconModule
    ],
    entryComponents: [
      TagFormModalComponent
    ],
    exports: [ TagFormModalComponent ]
})
export class TagModule { }
