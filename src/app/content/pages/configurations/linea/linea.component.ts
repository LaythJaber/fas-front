import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {LineaFormModalComponent} from './linea-form-modal.component';
import { Linea } from 'src/app/shared/models/linea';
import { ConfigurationsService } from 'src/app/shared/services/configurations.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { LazyRequest } from 'src/app/shared/dto/lazy-request';
import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.scss']
})
export class LineaComponent implements OnInit {

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.LINEA_DESCRIPTION',
  ];

  rows: Linea[] = [];
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
              private sweetAlertService: SweetAlertService,
              private breadcrumbService: BreadcrumbService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.getLazyLinea({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(text => {
      this.getLazyLinea({page: 1, pageSize: this.pageSize, textSearch: text});
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
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'LINEAS']);
  }

  getLazyLinea(request: LazyRequest) {
    this.loading = true;
    return this.configurationsService.getLazyLineas(request).subscribe(data => {
      this.rows = data.data;
      this.totalRecords = data.totalRecords;
      this.loading = false;
      this.firstCall = false;
    });
  }

  openFormDialog() {
    const dialogRef = this.matDialog.open(LineaFormModalComponent, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.page = 1;
        this.getLazyLinea({page: 1, pageSize: this.pageSize});
      }
    });
  }

  deleteLinea(linea: any, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') +  linea.description).then(e => {
      if (e.value) {
        this.configurationsService.deleteLinea(linea.id).subscribe(d => {
          if (d.status === 200) {
            this.getLazyLinea({page: this.page, pageSize: this.pageSize});
          }
        });
      }
    });
  }

  openEditLinea(b: Linea, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(LineaFormModalComponent, {
      width: '400px',
      disableClose: true,
      data: {editMode: true, linea: b}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      if (d) {
        this.getLazyLinea({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
      }
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazyLinea({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
  }

}
