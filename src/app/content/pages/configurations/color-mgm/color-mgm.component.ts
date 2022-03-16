import { Component, OnInit } from '@angular/core';
import {Color} from '../../../../shared/models/color';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {ColorService} from '../../../../shared/services/color.service';
import {MatDialog} from '@angular/material';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {LazyRequest} from '../../../../shared/dto/lazy-request';
import {ColorFormModalComponent} from './color-form-modal.component';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-color-mgm',
  templateUrl: './color-mgm.component.html',
  styleUrls: ['./color-mgm.component.scss']
})
export class ColorMgmComponent implements OnInit {
  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
    'DATA_TABLE.DESCRIPTION',
    'DATA_TABLE.COLOR',
    'DATA_TABLE.DESCRIPTION_WEB',
    'DATA_TABLE.STATUS',
  ];

  rows: Color[] = [];
  searchFormControl = new FormControl();
  totalRecords: number;
  pageSize = 10;
  page = 1;
  unsubscribe = new Subject();
  loading = true;
  firstCall = true;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];

  constructor(private colorService: ColorService,
              private matDialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private breadcrumbService: BreadcrumbService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService) { }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.getLazyColor({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(text => {
      this.getLazyColor({page: 1, pageSize: this.pageSize, textSearch: text});
    });
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }
  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'COLORS']);
  }

  getLazyColor(request: LazyRequest) {
    this.loading = true;
    return this.colorService.getLazyColors(request).subscribe(data => {
      this.rows = data.data;
      this.totalRecords = data.totalRecords;
      this.loading = false;
      this.firstCall = false;
    });
  }

  toggleColorState($event, color: Color) {
    $event.stopPropagation();
    this.colorService.toggleColorState(color.id).subscribe((response) => {
      if (response.status === 200) {
        color.enabled = !color.enabled;
      }
    });
  }

  openFormDialog() {
    const dialogRef = this.matDialog.open(ColorFormModalComponent, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.page = 1;
        this.getLazyColor({page: 1, pageSize: this.pageSize});
      }
    });
  }

  deleteColor(color: any, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') +  color.description).then(e => {
      if (e.value) {
        this.colorService.deleteColor(color.id).subscribe(d => {
          if (d.status === 200) {
            this.getLazyColor({page: this.page, pageSize: this.pageSize});
          }
        });
      }
    });
  }

  openEditColor(b: Color, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(ColorFormModalComponent, {
      width: '400px',
      disableClose: true,
      data: {editMode: true, color: b}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      if (d) {
        this.getLazyColor({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
      }
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazyColor({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
  }

}
