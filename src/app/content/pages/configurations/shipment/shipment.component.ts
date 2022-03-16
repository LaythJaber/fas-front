import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {SearchResponse} from "../../../../shared/dto/search-response";
import {MatDialog} from "@angular/material/dialog";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {TranslateService} from "@ngx-translate/core";
import {debounceTime} from "rxjs/operators";
import {ShipmentPageRequest} from "../../../../shared/models/shipment/shipment-page-request";
import {Shipment} from "../../../../shared/models/shipment/shipment";
import {ShipmentService} from "../../../../shared/services/shipment.service";
import {ShipmentFormComponent} from "./shipment-form/shipment-form.component";
import * as Inputmask from 'inputmask';
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss']
})
export class ShipmentComponent implements OnInit {

  @ViewChild('createAtElem') createAtElem: ElementRef;

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.DESCRIPTION',
    'DATA_TABLE.TIME',
    'DATA_TABLE.STATUS',
    'DATA_TABLE.COST',
    'DATA_TABLE.CREATED',
    'DATA_TABLE.UPDATED',
  ];

  filterForm: FormGroup;
  request: ShipmentPageRequest = new ShipmentPageRequest();
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  shipmentResponse: SearchResponse<Shipment>;

  constructor(
    private shipmentService: ShipmentService,
    private matDialog: MatDialog,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private breadcrumbService: BreadcrumbService,
  ) {
  }

  ngOnInit() {
    this.sendBreadCrumb();
    this.initFilterForm();
    this.request.page = 1;
    this.request.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.request.textSearch = '';
    this.getShipments();
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.request.pageSize);
    this.pageChange(1);
  }
  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'SHIPMENT']);
  }

  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      status: new FormControl(-1),
      createdAt: new FormControl(null),
      updatedAt: new FormControl(null),
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.request.textSearch = text;
        this.getShipments();
      });

    this.filterForm.get('status').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.enabled = value;
        this.getShipments();
      });

    this.filterForm.get('updatedAt').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          this.request.updatedAt = selectedDate;
        }
        else {
          this.request.updatedAt = '';
        }
        this.request.page = 1;
        this.getShipments();
      });

    this.filterForm.get('createdAt').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          this.request.createdAt = selectedDate;
        }
        else {
          this.request.createdAt = '';
        }
        this.request.page = 1;
        this.getShipments();
      });

    this.setDateMask();
  }

  getTwo(nbr): string {
    return (nbr <10)? '0' + nbr : '' + nbr;
  }

  getShipments() {
    this.shipmentService.getLazyShipment(this.request).subscribe(
      (response) => {
        this.shipmentResponse = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  pageChange($event) {
    this.request.page = $event;
    this.getShipments();
  }

  addShipment() {
    const dialogRef = this.matDialog.open(ShipmentFormComponent, {
      width: '60%',
      autoFocus: true,
      disableClose: false,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.getShipments();
    });
  }

  editShipment(data) {
    const dialogRef = this.matDialog.open(ShipmentFormComponent, {
      width: '80%',
      height: '80%',
      autoFocus: true,
      disableClose: false,
      data: {editMode: true, shipment: data}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.getShipments();
    });
  }

  changeShipmentStatus(shipment: Shipment) {
    this.shipmentService.changeShipmentStatus(shipment.id).subscribe(
      (response: any) => {
        shipment.enabled = !shipment.enabled;
      }
    );
  }

  deleteShipment(shipment: Shipment) {
    this.sweetAlertService
      .warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + ' ' + shipment.id + ' ?')
      .then(e => {
        if (e.value) {
          this.shipmentService.deleteShipment(shipment.id).subscribe(
            (response) => {
              if (response.status === 200) {
                this.getShipments();
                this.sweetAlertService.success(this.translate.instant('DIALOG.DELETE_SUCCESS'));
              }
            },
            (error) => {
              console.log('error = ', error);
              this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_DELETE') + ' ' + shipment.id);
            }
          );
        }
      });
  }

  setDateMask() {
    Inputmask('datetime', {
      inputFormat: 'dd/mm/yyyy',
      placeholder: 'dd/mm/aaaa'
    }).mask(this.createAtElem.nativeElement);
  }

}
