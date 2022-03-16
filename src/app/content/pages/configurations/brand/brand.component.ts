import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';
import { LazyRequest } from 'src/app/shared/dto/lazy-request';
import { Brand } from 'src/app/shared/models/brand';
import { BrandService } from 'src/app/shared/services/brand.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { BrandFormModalComponent } from './brand-form-modal.component';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {


  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
    'DATA_TABLE.BRAND_DESCRIPTION',
  ];

  rows: Brand[] = [];
  searchFormControl = new FormControl();
  totalRecords: number;
  pageSize = 10;
  page = 1;
  unsubscribe = new Subject();
  loading = true;
  firstCall = true;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];

  constructor(private brandService: BrandService,
              private matDialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private breadcrumbService: BreadcrumbService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.getLazyBrand({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(text => {
      this.getLazyBrand({page: 1, pageSize: this.pageSize, textSearch: text});
    });
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'BRANDS']);
  }

  getLazyBrand(request: LazyRequest) {
    this.loading = true;
    return this.brandService.getLazyBrands(request).subscribe(data => {
      this.rows = data.data;
      this.totalRecords = data.totalRecords;
      this.loading = false;
      this.firstCall = false;
    });
  }

  openFormDialog() {
    const dialogRef = this.matDialog.open(BrandFormModalComponent, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.page = 1;
        this.getLazyBrand({page: 1, pageSize: this.pageSize});
      }
    });
  }

  deleteBrand(brand: any, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') +  brand.description).then(e => {
      if (e.value) {
        this.brandService.deleteBrand(brand.id).subscribe(d => {
          if (d.status === 200) {
            this.getLazyBrand({page: this.page, pageSize: this.pageSize});
          }
        });
      }
    });
  }

  openEditBrand(b: Brand, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(BrandFormModalComponent, {
      width: '400px',
      disableClose: true,
      data: {editMode: true, brand: b}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      if (d) {
        this.getLazyBrand({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
      }
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazyBrand({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
  }

}
