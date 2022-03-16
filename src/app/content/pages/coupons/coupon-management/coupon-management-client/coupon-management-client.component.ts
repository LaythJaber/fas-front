import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClientPageRequest} from '../../../../../shared/dto/client-page-request';
import {Client} from '../../../../../shared/models/client';
import {ClientMgmService} from '../../../../../shared/services/client-mgm.service';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {SweetAlertService} from '../../../../../shared/services/sweet-alert.service';
import {FilterCouponClientsComponent} from '../filter-coupon-clients/filter-coupon-clients.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-coupon-management-client',
  templateUrl: './coupon-management-client.component.html',
  styleUrls: ['./coupon-management-client.component.scss']
})
export class CouponManagementClientComponent implements OnInit {

   request: ClientPageRequest ;
   filterForm: FormGroup;
   showFilter = false;
   clientResponse: Client[];
   totalRecords: number;
   @Output() newItemEventClient = new EventEmitter<Client[]>();

  @Input()
  selectedClients: Client[]  = [];

  @Input()
  editMode = false;

  @Input()
  editClicked = false;

  constructor(private clientService: ClientMgmService, private sweetAlertService: SweetAlertService, private translateService: TranslateService,
                private matDialog: MatDialog) { }

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.FULL_NAME',
    'DATA_TABLE.GENDER',
    'DATA_TABLE.EMAIL',
    'DATA_TABLE.MOBILE',
    'DATA_TABLE.SOURCE',
    'DATA_TABLE.CREATED',
    'DATA_TABLE.STATUS'
  ];

  ngOnInit() {
    this.request = new ClientPageRequest();
    this.request.textSearch = '';
    this.request.pageSize = 10;
    this.request.page = 1;
    this.initFilterForm();
    this.getClients();
   }


  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      createdAt: new FormControl(null),
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
      dateOfBirth: new FormControl(null),
      senzaOrdine: new FormControl(null),
      gender: new FormControl(null),

    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.request.textSearch = text;
        this.getClients();
      });


    this.filterForm.get('dateOfBirth').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          this.request.dateOfBirth = selectedDate;
        }  else {
          this.request.dateOfBirth = '';
        }
        this.request.page = 1;
        this.getClients();
      });

    this.filterForm.get('dateFrom').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          this.request.dateFrom = selectedDate;
        }  else {
          this.request.dateFrom = '';
        }
        this.request.page = 1;
        this.getClients();
      });


    this.filterForm.get('dateTo').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          this.request.dateTo = selectedDate;
        }  else {
          this.request.dateTo = '';
        }
        this.request.page = 1;
        this.getClients();
      });

    this.filterForm.get('senzaOrdine').valueChanges.subscribe(
    (d) => {
      this.request.page = 1;
      this.request.senzaOrdine = d;
      this.getClients();
    });

    this.filterForm.get('gender').valueChanges.subscribe(
      (d) => {
        this.request.page = 1;
        this.request.gender = d;
         this.getClients();
       });

  }

  showHideFilter() {
    this.showFilter = !this.showFilter;
  }

  getTwo(nbr): string {
    return (nbr < 10 ) ? '0' + nbr : '' + nbr;
  }


  getClients() {
    this.clientService.getClients(this.request).subscribe(
      (response) => {
        this.clientResponse = response.data;
        this.totalRecords = response.totalRecords;
      },
      (error) => {
        console.log(error);
      }
    );
  }


  changeClientStatus(client: Client) {
    this.clientService.changeClientBlockStatus(client.clientId).subscribe(
      (response) => {
        client.blocked = !client.blocked;
      }
    );
  }

  pageChange($event) {
    this.request.page = $event;
    this.getClients();
  }


  resetFilter() {
    this.filterForm.reset();
    this.request.page = 1;
    this.getClients();
   }




  addToClient(values: any, client: Client) {
     if (values.checked) {
      this.selectedClients = [...this.selectedClients, client];
     } else {
      const objIndex = this.selectedClients.findIndex(obj => obj.clientId  === client.clientId);
       this.selectedClients.splice(objIndex, 1 );
       this.selectedClients = [...this.selectedClients];
    }
    this.newItemEventClient.emit(this.selectedClients);
   }




   isChecked(client: Client) {
     return this.selectedClients.findIndex(l => l.clientId === client.clientId) >= 0 ? true : false;
     }


  openFilterClients() {
    const dialogRef = this.matDialog.open(FilterCouponClientsComponent, {
      width: '70%',
      autoFocus: true,
      disableClose: false,
      data: {clients: this.selectedClients}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
    });
  }
}
