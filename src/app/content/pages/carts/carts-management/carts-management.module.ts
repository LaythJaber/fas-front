import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTreeModule} from '@angular/material/tree';
import { MatFormFieldModule} from '@angular/material/form-field';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {CartsManagementComponent} from './carts-management.component';
import { CartManagementModalComponent } from './cart-management-modal/cart-management-modal.component';

const routes: Routes = [
  { path: '', component: CartsManagementComponent }
];

@NgModule({
  declarations: [ CartsManagementComponent, CartManagementModalComponent ],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(routes),
    SharedModule.forChild(),
    ReactiveFormsModule,
    NgbPaginationModule,
    MatDatepickerModule,
    NgbDropdownModule,
    MatCheckboxModule,
    MatDialogModule,
    FormsModule,
    NgbTooltipModule,
    MatTreeModule,
    MatFormFieldModule,
    NgbModule,
    CarouselModule
  ],
  providers: [
  ],
  entryComponents: [
    CartManagementModalComponent,
  ]
})
export class CartsManagementModule {}
