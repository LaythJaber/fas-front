import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Subject} from "rxjs";
import {SweetAlertService} from "../../../../shared/services/sweet-alert.service";
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";
import {TranslateService} from "@ngx-translate/core";
import {debounceTime, takeUntil} from "rxjs/operators";
import {LazyRequest} from "../../../../shared/dto/lazy-request";
import { Provider } from '@angular/compiler/src/core';
import { ProviderModalComponent } from './provider-modal.component';
import {ProviderMgmService} from "../../../../shared/services/provider-mgm.service";
import { MatDialog } from '@angular/material';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {


  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.DESCRIPTION',
  ];

  rows: Provider[] = [];
  searchFormControl = new FormControl();
  totalRecords: number;
  pageSize = 10;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  page = 1;
  unsubscribe = new Subject();
  loading = true;
  firstCall = true;

  constructor(private providerService: ProviderMgmService,
              private matDialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private breadcrumbService: BreadcrumbService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.getLazyProvider({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(text => {
      this.getLazyProvider({page: 1, pageSize: this.pageSize, textSearch: text});
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
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'PROVIDERS']);
  }

  getLazyProvider(request: LazyRequest) {
    this.loading = true;
    return this.providerService.getLazyProviderList(request).subscribe(data => {
      this.rows = data.data;
      this.totalRecords = data.totalRecords;
      this.loading = false;
      this.firstCall = false;
    });
  }

  openFormDialog() {
    const dialogRef = this.matDialog.open(ProviderModalComponent, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.page = 1;
        this.getLazyProvider({page: 1, pageSize: this.pageSize});
      }
    });
  }

  deleteProvider(provider: any, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') +  provider.description).then(e => {
      if (e.value) {
        this.providerService.deleteProvider(provider.id).subscribe(d => {
          if (d.status === 200) {
            this.getLazyProvider({page: this.page, pageSize: this.pageSize});
          }
        });
      }
    });
  }

  openEditProvider(b: Provider, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(ProviderModalComponent, {
      width: '400px',
      disableClose: true,
      data: {editMode: true, provider: b}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      if (d) {
        this.getLazyProvider({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
      }
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazyProvider({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
  }
}
