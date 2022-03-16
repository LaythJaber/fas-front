import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPriceListComponent } from './product-price-list.component';
import { ProductPriceListFormComponent } from './product-price-list-form/product-price-list-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', component: ProductPriceListComponent}
];

@NgModule({
  declarations: [ProductPriceListComponent, ProductPriceListFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    NgbModule,
    TranslateModule,
    NgSelectModule,
    FormsModule
  ]
})
export class ProductPriceListModule { }
