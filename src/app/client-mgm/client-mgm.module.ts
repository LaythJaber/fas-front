import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientMgmComponent } from './client-mgm.component';
import { RouterModule, Routes } from '@angular/router';
import {MatButtonModule, MatDatepickerModule, MatIconModule, MatInputModule, MatSelectModule, MatTabsModule} from '@angular/material';
import {NgbDropdownModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClientMgmModalComponent } from './client-mgm-modal/client-mgm-modal.component';
import { ClientMgmAddressesComponent } from './client-mgm-addresses/client-mgm-addresses.component';
import { ClientMgmInformationsComponent } from './client-mgm-informations/client-mgm-informations.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {TooltipModule} from 'ngx-bootstrap';
import { ClientMgmFavoritesComponent } from './client-mgm-favorites/client-mgm-favorites.component';
import {SharedModule} from '../shared/shared.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { ClientMgmCartComponent } from './client-mgm-cart/client-mgm-cart.component';


const routes: Routes = [
  {
    path: '',
    component: ClientMgmComponent
  }
];

@NgModule({
  declarations: [
    ClientMgmComponent,
    ClientMgmModalComponent,
    ClientMgmInformationsComponent,
    ClientMgmAddressesComponent,
    ClientMgmFavoritesComponent,
    ClientMgmCartComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    TranslateModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatTabsModule,
    MatDatepickerModule,
    NgSelectModule,
    NgbDropdownModule,
    TooltipModule,
    SharedModule,
    InfiniteScrollModule
  ],
  entryComponents: [
    ClientMgmModalComponent,
    ClientMgmInformationsComponent,
    ClientMgmAddressesComponent
  ]
})
export class ClientMgmModule {}
