import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {
  MatButtonModule,
  MatDividerModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTableModule
} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule, NgbPaginationModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../../shared/shared.module';
import {CategoryProductComponent} from './category-product.component';
import {MatIconModule} from '@angular/material/icon';
import { CategoryFormComponent } from './category-form/category-form.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatDatepickerModule} from '@angular/material/datepicker';

const routes: Routes = [
  {
    path: '', component: CategoryProductComponent
  }
];

@NgModule({
  declarations: [
    CategoryProductComponent,
    CategoryFormComponent
  ],
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
    NgbModule,
    MatIconModule,
    MatCheckboxModule,
    DragDropModule,
    ScrollingModule,
    MatDatepickerModule,
    FormsModule,
  ],
  entryComponents: [
    CategoryFormComponent
  ],
  exports: [CategoryProductComponent]
})
export class CategoryProductModule {
}
