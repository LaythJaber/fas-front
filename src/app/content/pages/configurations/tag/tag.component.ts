import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BreadcrumbService } from 'src/app/core/services/breadcrumb.service';
import { LazyRequest } from 'src/app/shared/dto/lazy-request';
import { Tag } from 'src/app/shared/models/tag';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { TagService } from 'src/app/shared/services/tag.service';
import { TagFormModalComponent } from './tag-form-modal.component';
import {TranslationLoaderService} from "../../../../core/services/translation-loader.service";
import {LocalStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.IMAGE',
    'DATA_TABLE.DESCRIPTION',
  ];

  rows: Tag[] = [];
  searchFormControl = new FormControl();
  totalRecords: number;
  pageSize;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  page = 1;
  unsubscribe = new Subject();
  loading = true;
  firstCall = true;
  siteActiveLanguage;

  constructor(private tagService: TagService,
              private matDialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private breadcrumbService: BreadcrumbService,
              private translate: TranslateService,
              private localStorageService: LocalStorageService,
              public translationLoaderService: TranslationLoaderService) {
    this.siteActiveLanguage = this.translationLoaderService.getActiveLanguage();
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.sendBreadCrumb();
    this.getLazyTag({page: this.page, pageSize: this.pageSize});
    this.searchFormControl.valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(text => {
      this.getLazyTag({page: 1, pageSize: this.pageSize, textSearch: text});
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
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'TAGS']);
  }

  getLazyTag(request: LazyRequest) {
    this.loading = true;
    return this.tagService.getLazyTags(request).subscribe(data => {
      this.rows = data.data;
      this.totalRecords = data.totalRecords;
      this.loading = false;
      this.firstCall = false;
    });
  }

  openFormDialog() {
    const dialogRef = this.matDialog.open(TagFormModalComponent, {
      width: '400px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.page = 1;
        this.getLazyTag({page: 1, pageSize: this.pageSize});
      }
    });
  }

  deleteTag(tag: any, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') +  tag.description).then(e => {
      if (e.value) {
        this.tagService.deleteTag(tag.id).subscribe(d => {
          if (d.status === 200) {
            this.getLazyTag({page: this.page, pageSize: this.pageSize});
          }
        });
      }
    });
  }

  openEditTag(b: Tag, i: number, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(TagFormModalComponent, {
      width: '400px',
      disableClose: true,
      data: {editMode: true, tag: b}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(d => {
      if (d) {
        this.getLazyTag({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
      }
    });
  }
  transformTagTranslations(t:Tag){
   const trans = t.tagTranslationDtos.map(a=>{
     return {
        description: a.description,
        langCode: a.langCode,
        langCodeId: a.langId
      }
    }
    )
    return trans;

  }


  pageChange(page: number) {
    this.page = page;
    this.getLazyTag({page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value});
  }
  getTranslatedDescription(tag: Tag) {
    if (this.siteActiveLanguage) {
      const tg  = tag.tagTranslationDtos.find(tg => {
        if (tg.langCode) {
          return  tg.langCode.toUpperCase() === this.siteActiveLanguage.toUpperCase()
        }
        return false;
      });
      if (tg) {
        return tg.description;
      }
    }
    return ;
  }
}
