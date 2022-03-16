import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {Client} from '../../../../shared/models/client';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {ClientMgmService} from '../../../../shared/services/client-mgm.service';
import {PromoService} from '../../../../shared/services/promo.service';
import {ClientPageRequest} from '../../../../shared/dto/client-page-request';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-filter-clients',
  templateUrl: './filter-clients.component.html',
  styleUrls: ['./filter-clients.component.scss']
})
export class FilterClientsComponent implements OnInit {
  filterClientForm: FormGroup;
  rows: Client[] = [];
  public page = 1;
  public totalRecords: number;
  public pageSize = 10;
  selectedClients: number[] = [];
  dialogRef: any;
  filterForm: FormGroup;
  request: ClientPageRequest;

  constructor(
    private clientService: ClientMgmService,
    private translate: TranslateService,
    public matDialogRef: MatDialogRef<FilterClientsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number[],
    private promoService: PromoService) {
  }

  ngOnInit() {
    this.initFilterForm();
    this.filterClientForm = new FormGroup({
      gender: new FormArray([]),
      professionId: new FormControl(null),
      companyId: new FormControl(null),
      province: new FormControl(null),
      dateOfBirthFrom: new FormControl(null),
      dateOfBirthTo: new FormControl(null),
      lastPassage: new FormControl(null),
      page: new FormControl(1),
    });
    if (this.data && this.data.length) {
      this.clientService.getClientsByIds(this.data).subscribe(r => {
        if (r) {
          this.rows = r;
          this.totalRecords = r.length;
          this.rows.forEach(c => {
            if (this.selectedClients.indexOf(c.clientId) === -1) {
              this.selectedClients = [...this.selectedClients, c.clientId];
            }
          });
        }
      });
    }
  }

  initFilterForm() {
    this.request = new ClientPageRequest();
    this.request.page = 1;
    this.request.pageSize = 1000000;
    this.request.textSearch = '';
    this.request.createdAt = '';
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      createdAt: new FormControl(null),
      cancelled: new FormControl(0),
      confirmed: new FormControl(0),
      status: new FormControl(-1),
    });
    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.textSearch = text;
      });
    this.filterForm.get('status').valueChanges.subscribe(
      (value) => {
        this.request.blocked = value;
      });
    this.filterForm.get('confirmed').valueChanges.subscribe(
      (d) => {
        this.request.confirmed = d ? 0 : 1;
      });
  }

  filter() {
    this.clientService.getClients(this.request).subscribe(
      (r) => {
        this.rows = r.data;
        this.totalRecords = r.totalRecords;
        this.selectedClients = [];
        this.rows.forEach(c => {
          if (this.selectedClients.indexOf(c.clientId) === -1) {
            this.selectedClients = [...this.selectedClients, c.clientId];
          }
        });
      });
  }


  isSelectedClient(c) {
    return this.selectedClients.indexOf(c.clientId) !== -1;
  }

  updateClientList(c: Client) {
    const index = this.selectedClients.indexOf(c.clientId);
    if (index === -1) {
      this.selectedClients = [...this.selectedClients, c.clientId];
      return;
    }
    this.selectedClients.splice(index, 1);
  }

  selectAll() {
    if (this.selectedClients.length === this.totalRecords) {
      this.selectedClients = [];
      return;
    }
    this.rows.forEach(c => {
      if (this.selectedClients.indexOf(c.clientId) === -1) {
        this.selectedClients = [...this.selectedClients, c.clientId];
      }
    });
  }

}
