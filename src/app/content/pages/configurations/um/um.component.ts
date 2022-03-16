import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';
import { Component, Inject, OnInit } from '@angular/core';
import { LazyRequest } from 'src/app/shared/dto/lazy-request';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { UmService } from 'src/app/shared/services/Um.service';
import { Um } from 'src/app/shared/models/um';
import { UmModalComponent } from './um-modal.component';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-um',
  templateUrl: './um.component.html',
  styleUrls: ['./um.component.scss']
})
export class UmComponent implements OnInit {

  searchFormControl = new FormControl();
  loading = false;
  rows: Um[] = [];
  totalRecords: number;
  pageSize;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  page = 1;
  columns = [
    'DATA_TABLE.ID',
    'UM_FORM.CODE',
    'UM_FORM.DESCRIPTION'
  ];
  dialogRef: any;

  constructor(
    private matDialog: MatDialog,
    private umService: UmService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private sweetAlertService: SweetAlertService,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.search({ page: 1, pageSize: this.pageSize });

  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }
  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'UM']);
  }

  openFormDialog() {
    this.dialogRef = this.matDialog.open(UmModalComponent, {
      width: '80%',
      autoFocus: true,
      disableClose: true,
      data: { editMode: false }
    });
    this.dialogRef.afterClosed().subscribe(d => {
      this.search({ page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value });
    });
  }

  search(request: LazyRequest) {
    this.loading = true;
    return this.umService.getAllLazy(request).subscribe(data => {
      console.log(data);
      this.rows = data.data;
      this.loading = false;
      this.totalRecords = data.totalRecords;
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.search({ page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value });
  }

  edit(um, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.dialogRef = this.matDialog.open(UmModalComponent, {
      width: '80%',
      autoFocus: true,
      disableClose: true,
      data: { editMode: true,
      um: um}
    });
    this.dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.search({ page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value });
      }
    });
  }

  delete(um, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + um.code).then(e => {
      if (e.value) {
        this.umService.deleteUm(um.id).subscribe(() => {
          this.sweetAlertService.danger(this.translate.instant('DIALOG.DELETE_SUCCESS')).then(e => {
          });
          this.search({ page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value });
        }, e => {
          this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_DELETE')).then(e => {
          });
        });
      }
    });
  }


}
