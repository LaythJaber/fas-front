import { LanguageService } from './../../../../shared/services/language.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';
import { LazyRequest } from 'src/app/shared/dto/lazy-request';
import { Language } from 'src/app/shared/models/language';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { LanguageFormModalComponent } from './language-form-modal.component';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {


  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.CODE',
    'DATA_TABLE.DESCRIPTION',
  ];

  rows: Language[] = [];
  searchFormControl = new FormControl();
  totalRecords: number;
  pageSize;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  page = 1;
  unsubscribe = new Subject();
  loading = true;
  firstCall = true;

  constructor(private languageService: LanguageService,
              private matDialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private breadcrumbService: BreadcrumbService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.getLazyLanguage({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(text => {
      this.getLazyLanguage({page: 1, pageSize: this.pageSize, textSearch: text});
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
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'LANGUAGES']);
  }

  getLazyLanguage(request: LazyRequest) {
    this.loading = true;
    return this.languageService.getLazyLanguages(request).subscribe(data => {
      this.rows = data.data;
      this.totalRecords = data.totalRecords;
      this.loading = false;
      this.firstCall = false;
    });
  }

  openFormDialog() {
    const dialogRef = this.matDialog.open(LanguageFormModalComponent, {
      width: '600px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.page = 1;
        this.getLazyLanguage({page: 1, pageSize: this.pageSize});
      }
    });
  }

  deleteLanguage(language: any, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') +  language.description).then(e => {
      if (e.value) {
        this.languageService.deleteLanguage(language.id).subscribe(d => {
          if (d.status === 200) {
            this.getLazyLanguage({page: this.page, pageSize: this.pageSize});
          }
        });
      }
    });
  }

  openEditLanguage(b: Language, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(LanguageFormModalComponent, {
      width: '600px',
      disableClose: true,
      data: {editMode: true, language: b}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      if (d) {
        this.getLazyLanguage({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
      }
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.getLazyLanguage({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
  }


}
