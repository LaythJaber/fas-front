import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {SearchResponse} from '../../../../shared/dto/search-response';
import {ZipCode} from '../../../../shared/models/zip-code';
import {ZipCodePageRequest, ZipCodeService} from '../../../../shared/services/zip-code.service';
import {SellPoint} from '../../../../shared/models/sell-point';
import {SellPointService} from '../../../../shared/services/sell-point.service';
import {Enterprise} from '../../../../shared/models/enterprise';
import {debounceTime} from 'rxjs/operators';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-cap',
  templateUrl: './cap.component.html',
  styleUrls: ['./cap.component.scss']
})
export class CapComponent implements OnInit {

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.ZIP_CODE',
    'DATA_TABLE.CITY',
    'DATA_TABLE.PROVINCE',
    'DATA_TABLE.COUNTRY',
    'DATA_TABLE.STATUS',
  ];

  @Input() enterprise: Enterprise;
  filterForm: FormGroup;
  allZipCodesSelected = false;
  zipCodeResponse: ZipCode[];
  zipCodeResponseAll: SearchResponse<ZipCode>;
  request: ZipCodePageRequest;
  zipCodesSelectedList: number[] = [];
  sellPointsList: { sellPointId: number, sellPointLabel: string }[] ;
  provinceList: {label: string, value: string}[] = [];
  countryFormControl = new FormControl(null);
  zipCodeSelectedInLoading = false;
  showAllCaps = true;
  id: number = null;
  sellpoint: SellPoint = new SellPoint();
  deleteAllCaps = false;
    constructor(private translateService: TranslateService, private  zipCodeService: ZipCodeService, private sellPointService: SellPointService,
              private sessionStorage: SessionStorageService, private matDialog: MatDialog, private localstorage: LocalStorageService,
              private router: Router, private sweetAlertService: SweetAlertService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.zipCodesSelectedList = [];
    this.initFilterForm() ;
    this. initZipCodeRequest();
    this.initSellPointsFromAccount();
    this.getProvinceListByCountry();
    this.getZipCodesBySellpoint();
  }


  resetFilter() {
    this.showAllCaps = true;
    this.request.sellPointId = this.id;
    this.zipCodesSelectedList = [];
     this.deleteAllCaps = false;
    this.sellpoint = new SellPoint();
    this.initFilterForm();
    this.initZipCodeRequest();
    this.getZipCodesBySellpoint();
   }

  initSellPointsFromAccount() {
    this.sellPointService.getSellPointsFromAccountAndAdmin().subscribe(u => {
      this.sellPointsList = u.sellPoints;
    });
   }

   getZipCodesBySellpoint(){
    if (!this.showAllCaps) {
      this.request.sellPointId = null;
    }
    this.zipCodeService.getFilteredZipCodes(this.request).subscribe(
      (response) => {
        this.zipCodeResponseAll = response;
        this.sellpoint.id = this.id;
        this.filterCapsAssociated();
      }
    );
   }

  filterCapsAssociated()  {
     this.zipCodeService.filterCapsAssociated(this.sellpoint).subscribe(
      (response1) => {
        this.zipCodeResponse = response1;
         for (let i = 0; i < this.zipCodeResponseAll.data.length; i++) {
          this.zipCodeResponse.map(e => {
            if ( e.id === this.zipCodeResponseAll.data[i].id) {
              if (!this.isChecked(this.zipCodeResponseAll.data[i])) {
                this.zipCodesSelectedList.push(this.zipCodeResponseAll.data[i].id);
               }
             }
          });
        }
      }
    );
  }

  affectOrDesaffectSelectedCaps(msg: string) {

     this.sellpoint.id = this.filterForm.get('selling').value;
     this.sellpoint.name = this.sellPointsList.find(item => item.sellPointId === this.sellpoint.id).sellPointLabel;

     this.sweetAlertService
      .warning(msg)
      .then(e => {
        if (e.value) {
             if ( this.deleteAllCaps || this.sellpoint.associatAllCaps ) {
               this.sellpoint.capAss = null;
             } else {
                this.sellpoint.capAss = this.zipCodesSelectedList;
             }
          this.zipCodeSelectedInLoading = true;
            this.zipCodeService.editCaps(this.sellpoint).subscribe(
            (response) => {
              this.zipCodeSelectedInLoading = false;
              this.zipCodeSelectedInLoading = false;
              this.deleteAllCaps = false;
              this.sellpoint.associatAllCaps = false;
              this.zipCodesSelectedList = [];
               this.snackBar.open(this.translateService.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
                  this.getZipCodesBySellpoint();
             }, (error) => {
                this.snackBar.open(this.translateService.instant('DIALOG.CANNOT_UPDATE'), 'Ok', {duration: 5000});
          });
        }
      });
  }

  initFilterForm() {
    if ( this.sessionStorage.retrieve('user')) {
      this.id = this.sessionStorage.retrieve('user').sellPointId;
    } else if (this.localstorage.retrieve('user')) {
      this.id = this.localstorage.retrieve('user').sellPointId;
    }

    this.zipCodesSelectedList = [];
     this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      status: new FormControl(-1),
      country: new FormControl('IT'),
      province: new FormControl(null),
      selling: new FormControl(this.id),
      capsAss: new FormControl(1)

     });

    this.filterForm.get('selling').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.id = text;
        this.request.sellPointId = text;
        this.zipCodesSelectedList = [];
         this.getZipCodesBySellpoint();
      });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.request.textSearch = text;
        this.getZipCodesBySellpoint();
      });

    this.filterForm.get('country').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.country = value;
        this.getZipCodesBySellpoint();
      });


    this.filterForm.get('province').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.province = value;
        this.getZipCodesBySellpoint();
      });

    this.filterForm.get('status').valueChanges.subscribe(
      (value) => {
        this.request.page = 1;
        this.request.enabled = value;
        this.getZipCodesBySellpoint();
      });


    this.filterForm.get('capsAss').valueChanges.subscribe((value) => {
      this.request.page = 1;
      if ( value === 1) {
          this.request.sellPointId = this.id;
        this.showAllCaps = true;
      } else if (value === -1) {
        this.showAllCaps = false;
      }
      this.getZipCodesBySellpoint();
    });

  }

  initZipCodeRequest() {
    let id = null;
    if (this.sessionStorage.retrieve('user')) {
      id = this.sessionStorage.retrieve('user').sellPointId;
    } else if (this.localstorage.retrieve('user')) {
      id = this.localstorage.retrieve('user').sellPointId;
    }

    this.request = new ZipCodePageRequest();
    this.request.page = 1;
    this.request.pageSize = 10;
    this.request.textSearch = '';
    this.request.sellPointId = id;
    this.sellpoint.id = this.request.sellPointId;

  }

  selectPageZipCodes($event) {
    for (let i = 0; i < this.zipCodeResponseAll.data.length; i++) {
      if ($event.checked && (this.zipCodesSelectedList.findIndex(e  => e === this.zipCodeResponseAll.data[i].id) < 0)) {
        this.zipCodesSelectedList = [...this.zipCodesSelectedList, this.zipCodeResponseAll.data[i].id];
      } else {
        const index1 = this.zipCodesSelectedList.findIndex(e  => e === this.zipCodeResponseAll.data[i].id);
        if ( index1 >= 0) {
           this.zipCodesSelectedList.splice(index1, 1 );
           this.zipCodesSelectedList = [...this.zipCodesSelectedList];
        }
      }
    }
  }

  selectCap(values: any, zipCode) {
       if (values.checked ) {
           this.zipCodesSelectedList = [...this.zipCodesSelectedList, zipCode.id];
       } else if (!values.checked) {
         const index1 = this.zipCodesSelectedList.findIndex(e  => e === zipCode.id);
         if ( index1 >= 0) {
          this.zipCodesSelectedList.splice(index1, 1 );
          this.zipCodesSelectedList = [...this.zipCodesSelectedList];
         }
       }
    }

  isChecked(zipCode) {
      return this.zipCodesSelectedList.findIndex(l => l === zipCode.id) >= 0;
    }

  getProvinceListByCountry()  {
    this.zipCodeService.getProvincesByCountry('IT').subscribe((response) => {
      this.provinceList = [];
      for (const pr of response) {
        this.provinceList.push({label: pr, value: pr});
      }
      this.provinceList = [...this.provinceList];
    });
  }

  isThereCapsAssociated(): boolean {
    return this.filterForm.get('capsAss').value === 1 ;
  }

  isThereZipCodes() {
    if ( this.zipCodeResponseAll && this.zipCodeResponseAll.data.length === 0 ) {
        return true;
      }
      return false;
  }

  goToAddCaps() {
     this.filterForm.get('capsAss').setValue(-1);
  }

  affectAllCaps() {
  this.sellpoint.associatAllCaps = true;
  this.affectOrDesaffectSelectedCaps(' Salva tutti CAP ?');
  }

  desAffectAllCaps() {
    this.sellpoint.associatAllCaps = false;
    this.deleteAllCaps = true;
    this.affectOrDesaffectSelectedCaps('Cancellare tutti CAP ?');
  }

  editSelectedCaps() {
    this.sellpoint.associatAllCaps = false;
    this.deleteAllCaps = false;
    this.affectOrDesaffectSelectedCaps('Desideri assegnare i CAP selezionati?');
  }

  showRows() {
    this.request.page = 1;
    this.getZipCodesBySellpoint();
  }

   pageChange($event) {
    this.request.page = $event;
    if (!this.showAllCaps) {
      this.request.sellPointId = null;
    }
    this.getZipCodesBySellpoint();
   }

}
