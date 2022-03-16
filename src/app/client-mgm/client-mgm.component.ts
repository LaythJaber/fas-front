import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ClientMgmService } from '../shared/services/client-mgm.service';
import { Client } from '../shared/models/client';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ClientMgmModalComponent} from './client-mgm-modal/client-mgm-modal.component';
import {ClientPageRequest} from '../shared/dto/client-page-request';
import {SearchResponse} from '../shared/dto/search-response';
import {debounceTime} from 'rxjs/operators';
import * as Inputmask from 'inputmask';
import {SweetAlertService} from '../shared/services/sweet-alert.service';
import {TranslateService} from '@ngx-translate/core';
import {BreadcrumbService} from '../core/services/breadcrumb.service';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-client-mgm',
  templateUrl: './client-mgm.component.html',
  styleUrls: ['./client-mgm.component.scss']
})
export class ClientMgmComponent implements OnInit {
  @ViewChild('createAtElem') createAtElem: ElementRef;

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
    'DATA_TABLE.FULL_NAME',
    'DATA_TABLE.GENDER',
    'DATA_TABLE.EMAIL',
    'DATA_TABLE.MOBILE',
    'DATA_TABLE.SOURCE',
    'DATA_TABLE.CREATED',
    'DATA_TABLE.STATUS'
  ];

  filterForm: FormGroup;
  request: ClientPageRequest = new ClientPageRequest();
  clientResponse: SearchResponse<Client>;

  clientsNonConfirmedNumber = 0;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];

  constructor(
    private clientService: ClientMgmService,
    private matDialog: MatDialog,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    this.sendBreadCrumb();
    this.request.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.getClientsNonConfirmed();
    this.initFilterForm();
    this.request.page = 1;
    this.request.textSearch = '';
    this.getClients();
  }

  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      status: new FormControl(-1),
      createdAt: new FormControl(null),
      cancelled: new FormControl(false),
      confirmed: new FormControl(false),
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.request.textSearch = text;
        this.getClients();
      });

    this.filterForm.get('status').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.blocked = value;
        this.getClients();
      });

    this.filterForm.get('cancelled').valueChanges.subscribe(
      (d) => {
        if (d) {
          this.request.cancelled = 1;
          this.request.sort = {attribute: 'cancelledAt', direction: 'DESC'};
        } else {
          this.request.cancelled = 0;
          this.request.sort = null;
        }
        this.request.page = 1;
        this.getClients();
      });

    this.filterForm.get('confirmed').valueChanges.subscribe(
      (d) => {
        if (d) {
          this.request.confirmed = 0;
        } else {
          this.request.confirmed = 1;
        }
        this.request.page = 1;
        this.getClients();
      });

    this.filterForm.get('createdAt').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          this.request.createdAt = selectedDate;
        } else {
          this.request.createdAt = '';
        }
        this.request.page = 1;
        this.getClients();
      });

    this.setDateMask();
  }

  getTwo(nbr): string {
    return (nbr < 10) ? '0' + nbr : '' + nbr;
  }

  getClientsNonConfirmed() {
    const request: ClientPageRequest = new ClientPageRequest();
    request.page = 1;
    request.pageSize = 1;
    request.confirmed = 0;
    this.clientService.getClients(request).subscribe(
      (response) => {
        this.clientsNonConfirmedNumber = response.totalRecords;
      }
    );
  }

  getClients() {
    this.clientService.getClients(this.request).subscribe(
      (response) => {
        this.clientResponse = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  pageChange($event) {
    this.request.page = $event;
    this.getClients();
  }
  changePageSize() {
    this.localStorageService.store('pageSize', this.request.pageSize);
    this.pageChange(1);
  }

  addNewClient() {
    const dialogRef = this.matDialog.open(ClientMgmModalComponent, {
      width: '450%',
      height: '95%',
      autoFocus: true,
      disableClose: false,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.getClientsNonConfirmed();
      this.getClients();
    });
  }

  editClient(data) {
    const dialogRef = this.matDialog.open(ClientMgmModalComponent, {
      width: '450%',
      height: '95%',
      autoFocus: true,
      disableClose: false,
      data: {editMode: true, client: data}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.getClients();
    });
  }

  changeClientStatus(client: Client) {
     this.clientService.changeClientBlockStatus(client.clientId).subscribe(
       (response) => {
         client.blocked = !client.blocked;
       }
     );
  }

  deleteClient(client: Client) {
    this.sweetAlertService
      .warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + client.firstName + ' ' + client.lastName)
      .then(e => {
        if (e.value) {
          this.clientService.deleteClient(client.clientId).subscribe(
            (response) => {
              if (response.status === 200) {
                this.getClients();
                this.getClientsNonConfirmed();
                this.sweetAlertService.success(this.translate.instant('DIALOG.DELETE_SUCCESS'));
              }
            },
            (error) => {
              console.log('error = ', error);
              this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_DELETE')
                + ' ' + client.firstName + ' ' + client.lastName);
            }
          );
        }
      });
  }

  confirmClient(client) {
    this.sweetAlertService
      .warning('You want to confirm ' + client.firstName + ' ' + client.lastName + ' ?')
      .then(e => {
        if (e.value) {
          this.clientService.confirmClient(client.clientId).subscribe(
            (response) => {
              this.getClientsNonConfirmed();
              this.getClients();
              this.sweetAlertService.success('Client confirmed successfully');
            },
            (error) => {
              console.log('error = ', error);
              this.sweetAlertService.danger('Client not confirmed ' + ' ' + client.firstName + ' ' + client.lastName);
            }
          );
        }
      });
  }

  setDateMask() {
    Inputmask('datetime', {
      inputFormat: 'dd/mm/yyyy',
      placeholder: 'dd/mm/yyyy'
    }).mask(this.createAtElem.nativeElement);
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CLIENTS']);
  }

}
