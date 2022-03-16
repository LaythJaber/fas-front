import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';
import { CustomSnackBarComponent } from 'src/app/shared/compoenent/custom-snack-bar/custom-snack-bar.component';
import { LazyRequest } from 'src/app/shared/dto/lazy-request';
import { Reparto } from 'src/app/shared/models/reparto';
import { ConfigurationsService } from 'src/app/shared/services/configurations.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { RepartoFormModalComponent } from './reparto-form-modal.component';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-reparto',
  templateUrl: './reparto.component.html',
  styleUrls: ['./reparto.component.scss']
})
export class RepartoComponent implements OnInit {

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.DESCRIPTION',
  ];

  rows: Reparto[] = [];
  searchFormControl = new FormControl();
  totalRecords: number;
  pageSize;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  page = 1;
  unsubscribe = new Subject();
  loading = true;
  firstCall = true;

  constructor(private configurationsService: ConfigurationsService,
              private matDialog: MatDialog,
              private localStorageService: LocalStorageService,
              private sweetAlertService: SweetAlertService,
              private breadcrumbService: BreadcrumbService,
              private translate: TranslateService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.getLazyReparto({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(text => {
      this.getLazyReparto({page: 1, pageSize: this.pageSize, textSearch: text});
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
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'REPARTOS']);
  }

  getLazyReparto(request: LazyRequest) {
    this.loading = true;
    return this.configurationsService.getLazyRepartos(request).subscribe(data => {
      this.rows = data.data;
      this.totalRecords = data.totalRecords;
      this.loading = false;
      this.firstCall = false;
    });
  }

  openFormDialog() {
    const dialogRef = this.matDialog.open(RepartoFormModalComponent, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.page = 1;
        this.getLazyReparto({page: 1, pageSize: this.pageSize});
      }
    });
  }

  deleteReparto(Reparto: any, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') +  Reparto.description).then(e => {
      if (e.value) {
        this.configurationsService.deleteReparto(Reparto.id).subscribe(d => {
          if (d.status === 200) {
            this.getLazyReparto({page: this.page, pageSize: this.pageSize});
          }
        }, err => {
            this.showSnackBar({
              text: '',
              actionIcon: 'failed',
              actionMsg: this.translate.instant('DIALOG.CANNOT_DELETE')
            });

        });
      }
    });
  }

  showSnackBar(data: any) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data,
      duration: 5000,
      panelClass: 'white-snackbar'
    });
  }

  openEditReparto(b: Reparto, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(RepartoFormModalComponent, {
      width: '400px',
      disableClose: true,
      data: {editMode: true, reparto: b}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      if (d) {
        this.getLazyReparto({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
      }
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazyReparto({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
  }


}
