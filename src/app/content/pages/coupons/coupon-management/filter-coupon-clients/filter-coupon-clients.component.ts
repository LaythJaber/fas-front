import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ClientMgmService} from '../../../../../shared/services/client-mgm.service';
import {Client} from '../../../../../shared/models/client';
import {ClientPageRequest} from '../../../../../shared/dto/client-page-request';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-filter-coupon-clients',
  templateUrl: './filter-coupon-clients.component.html',
  styleUrls: ['./filter-coupon-clients.component.scss']
})
export class FilterCouponClientsComponent implements OnInit {

  client: Client[];
  filterForm: FormGroup;
  request: ClientPageRequest;
  totalRecords: number;
  searchText: string = '';

  constructor(public dialogRef: MatDialogRef<FilterCouponClientsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.client = this.data.clients;
   }

  ngOnInit() {
  }



}
