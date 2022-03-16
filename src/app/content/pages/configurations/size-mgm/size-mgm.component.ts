import {Component, OnInit} from '@angular/core';
import {Size} from '../../../../shared/models/size';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {SizeService} from '../../../../shared/services/size.service';
import {MatDialog} from '@angular/material';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {LazyRequest} from '../../../../shared/dto/lazy-request';
import {SizeFormModalComponent} from './size-form-modal.component';
import {LocalStorageService} from 'ngx-webstorage';
import {Color} from "../../../../shared/models/color";

@Component({
  selector: 'app-size-mgm',
  templateUrl: './size-mgm.component.html',
  styleUrls: ['./size-mgm.component.scss']
})
export class SizeMgmComponent implements OnInit {
  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
    'DATA_TABLE.DESCRIPTION',
    'schemas number',
    'DATA_TABLE.STATUS',
  ];

  rows: Size[] = [];
  searchFormControl = new FormControl();
  totalRecords: number;
  pageSize = 10;
  page = 1;
  unsubscribe = new Subject();
  loading = true;
  firstCall = true;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];

  constructor(private sizeService: SizeService,
              private matDialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private breadcrumbService: BreadcrumbService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService) {
  }


  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.getLazySize({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(text => {
      this.getLazySize({page: 1, pageSize: this.pageSize, textSearch: text});
    });
  }

  toggleSizeState($event, size: Size) {
    $event.stopPropagation();
    console.log("size = ", size)
    this.sizeService.toggleSizeState(size.id).subscribe((response) => {
      console.log("response size = ", response)
      if (response.status === 200) {
        size.enabled = !size.enabled;
      }
    });
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'SIZES']);
  }

  getLazySize(request: LazyRequest) {
    this.loading = true;
    return this.sizeService.getLazySizes(request).subscribe(data => {
      this.rows = data.data;
      this.totalRecords = data.totalRecords;
      this.loading = false;
      this.firstCall = false;
    });
  }

  openFormDialog() {
    const dialogRef = this.matDialog.open(SizeFormModalComponent, {
      width: '1000px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      this.getLazySize({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
    });
  }

  deleteSize(size: any, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + size.description).then(e => {
      if (e.value) {
        this.sizeService.deleteSize(size.id).subscribe(d => {
          if (d.status === 200) {
            this.getLazySize({page: this.page, pageSize: this.pageSize});
          }
        });
      }
    });
  }

  openEditSize(b: Size, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(SizeFormModalComponent, {
      width: '1000px',
      disableClose: true,
      data: {editMode: true, size: Object.assign({}, b)}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      console.log(d);
      this.getLazySize({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazySize({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
  }


}
