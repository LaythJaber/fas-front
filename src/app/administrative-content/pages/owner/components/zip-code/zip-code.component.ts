import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {SearchResponse} from "../../../../../shared/dto/search-response";
import {MatDialog} from "@angular/material/dialog";
import {SweetAlertService} from "../../../../../shared/services/sweet-alert.service";
import {TranslateService} from "@ngx-translate/core";
import {debounceTime} from "rxjs/operators";
import {ShipmentFormComponent} from "../../../../../content/pages/configurations/shipment/shipment-form/shipment-form.component";
import {ZipCodePageRequest, ZipCodeService} from "../../../../../shared/services/zip-code.service";
import {ZipCode} from "../../../../../shared/models/zip-code";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-zip-code',
  templateUrl: './zip-code.component.html',
  styleUrls: ['./zip-code.component.scss']
})
export class ZipCodeComponent implements OnInit {

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.ZIP_CODE',
    'DATA_TABLE.CITY',
    'DATA_TABLE.PROVINCE',
    'DATA_TABLE.COUNTRY',
    'DATA_TABLE.STATUS',
  ];

  filterForm: FormGroup;
  request: ZipCodePageRequest;
  zipCodeResponse: SearchResponse<ZipCode>;

  provinceList: {label: string, value: string}[] = [];
  allZipCodesSelected: boolean = false;
  zipCodesSelectedList: boolean[] = [];
  zipCodeSelectedInLoading: boolean = false;
  zipCodeFilteredInLoading: boolean = false;

  constructor(
    private zipCodeService: ZipCodeService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private sweetAlertService: SweetAlertService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.initFilterForm();
    this.initZipCodeRequest();
    this.getZipCodes();
    this.getProvinceListByCountry();
  }

  initZipCodeRequest() {
    this.request = new ZipCodePageRequest();
    this.request.page = 1;
    this.request.pageSize = 10;
    this.request.textSearch = '';
  }

  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      status: new FormControl(-1),
      country: new FormControl('IT'),
      province: new FormControl(null),
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.request.textSearch = text;
        this.getZipCodes();
      });

    this.filterForm.get('status').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.enabled = value;
        this.getZipCodes();
      });

    this.filterForm.get('country').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.country = value;
        this.getZipCodes();
      });

    this.filterForm.get('province').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.province = value;
        this.getZipCodes();
      });

  }

  getZipCodes() {
    this.zipCodeService.getFilteredZipCodes(this.request).subscribe(
      (response) => {
        this.zipCodeResponse = response;
        this.zipCodesSelectedList = new Array(this.zipCodeResponse.data.length);
        this.allZipCodesSelected = false;
      }
    );
  }

  resetFilter() {
    this.initFilterForm();
    this.initZipCodeRequest();
    this.getZipCodes();
  }

  getProvinceListByCountry() {
    this.zipCodeService.getProvincesByCountry('IT').subscribe((response) => {
      this.provinceList = [];
      for (const pr of response) {
        this.provinceList.push({label: pr, value: pr});
      }
      this.provinceList = [...this.provinceList];
    })
  }

  pageChange($event) {
    this.request.page = $event;
    this.getZipCodes()
  }

  showRows() {
    this.request.page=1;
    this.getZipCodes();
  }


  selectPageZipCodes($event) {
    for (let i =0; i<this.zipCodesSelectedList.length; i++) {
      this.zipCodesSelectedList[i] = $event.checked;
    }
  }

  isThereZipCodesSelected(): boolean {
    for (const r of this.zipCodesSelectedList) {
      if (r === true) {
        return true;
      }
    }
    return false;
  }

  getSelectedNbr(): number {
    let nbr =0;
    for (const r of this.zipCodesSelectedList) {
      if (r === true) {
        nbr++;
      }
    }
    return nbr;
  }


  enableOne(zipCode: ZipCode) {
    this.zipCodeService.enableOne(zipCode.id).subscribe(
      (response: any) => {
        console.log("enable one reponse = ", response);
        zipCode.enabled = !zipCode.enabled;
      }
    );
  }

  enableAllSelected(status: boolean) {
    const zipCodeIds: number[] = [];
    for (let i =0; i<this.zipCodesSelectedList.length; i++) {
      if (this.zipCodesSelectedList[i] === true) {
        zipCodeIds.push(this.zipCodeResponse.data[i].id);
      }
    }
    this.sweetAlertService
      .warning('Vuoi abilitare cap selezionati ?')
      .then(e => {
        if (e.value) {
          this.zipCodeSelectedInLoading = true;
          this.zipCodeService.enableAllSelected(zipCodeIds, status).subscribe(
            (response) => {
              this.zipCodeSelectedInLoading = false;
              this.zipCodesSelectedList = new Array(this.zipCodeResponse.data.length);
              this.snackBar.open(this.translateService.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
              this.getZipCodes();
            }, (error) => {
              this.zipCodeSelectedInLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_UPDATE'), 'Ok', {duration: 5000});
            });
        }
      });
  }

  enableAllFiltered(status: boolean) {
    this.sweetAlertService
      .warning('Vuoi abilitare tutti i cap filtrati (' + this.zipCodeResponse.data.length + ') ?')
      .then(e => {
        if (e.value) {
          this.zipCodeFilteredInLoading = true;
          this.zipCodeService.enableAllFiltered(this.request, status).subscribe(
            (response) => {
              this.zipCodeFilteredInLoading = false;
              this.zipCodesSelectedList = new Array(this.zipCodeResponse.data.length);
              this.snackBar.open(this.translateService.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
              this.getZipCodes();
            }, (error) => {
              this.zipCodeFilteredInLoading = false;
              this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_UPDATE'), 'Ok', {duration: 5000});
            });
        }
      });
  }

  addZipCode() {
    const dialogRef = this.matDialog.open(ShipmentFormComponent, {
      width: '60%',
      autoFocus: true,
      disableClose: false,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.getZipCodes();
    });
  }

  editZipCode(data) {
    const dialogRef = this.matDialog.open(ShipmentFormComponent, {
      width: '80%',
      height: '80%',
      autoFocus: true,
      disableClose: false,
      data: {editMode: true, shipment: data}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      this.getZipCodes();
    });
  }

  deleteZipCode(zipCode: ZipCode) {
    this.sweetAlertService
      .warning(this.translateService.instant('DIALOG.YOU_WANT_TO_DELETE') + ' ' + zipCode.cap + ' ?')
      .then(e => {
        if (e.value) {
          this.zipCodeService.deleteZipCode(zipCode.id).subscribe(
            (response) => {
              if (response.status === 200) {
                this.snackBar.open(this.translateService.instant('DIALOG.DELETE_SUCCESS'), 'Ok', {duration: 5000});
                this.getZipCodes();
              }
            },
            (error) => {
              console.log('error = ', error);
              this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_DELETE'), 'Ok', {duration: 5000});
            }
          );
        }
      });
  }

}
