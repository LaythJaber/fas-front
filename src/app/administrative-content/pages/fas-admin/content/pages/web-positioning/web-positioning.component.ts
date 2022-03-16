import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {LanguageService} from "../../../../../../shared/services/language.service";
import {WebPositioningService} from "../../../../../../shared/services/web-positioning.service";
import {Language} from "../../../../../../shared/models/language";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-web-positioning',
  templateUrl: './web-positioning.component.html',
  styleUrls: ['./web-positioning.component.scss']
})
export class WebPositioningComponent implements OnInit, OnDestroy {
  robots = [
    "index",
    "noindex",
    "none",
    "follow",
    "nofollow",
    "noarchive",
    "nosnippet",
    "noodp",
    "noydir",
    "noimageindex"
  ];
  webPositioningForm: FormGroup;
  page;
  langs: Language[];
  selectedTab: number;
  unsub$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private languageService: LanguageService,
    private webPositioningService: WebPositioningService,
    private translateService: TranslateService,
    private matSnackbar: MatSnackBar
  ) {
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  ngOnInit() {
    this.activatedRoute.data
      .pipe(takeUntil(this.unsub$))
      .subscribe(({langs}) => {
        this.langs = langs;
      });
    this.page = this.activatedRoute.snapshot.paramMap.get('page');
    this.webPositioningForm = this.formBuilder.group({
      page: this.page.toUpperCase(),
      metaTagsTrans: this.formBuilder.array([]),
      robots: null,
    });
    this.activatedRoute.paramMap.pipe(takeUntil(this.unsub$))
      .subscribe(v => {
        this.page = v.get('page');
        this.webPositioningForm.reset();
        this.webPositioningForm.get('page').setValue(this.page);
        this.formSetup()
      });
  }

  get metaTagsTrans() {
    return this.webPositioningForm.get('metaTagsTrans') as FormArray;
  }

  save() {
    this.webPositioningService.update(this.webPositioningForm.value).subscribe(() => {
      this.matSnackbar.open(this.translateService.instant('MULTIMEDIA.UPDATED_SUCCESS') + '⚡', 'Ok', {duration: 1500});
    });
  }

  private formSetup() {
    if (this.metaTagsTrans) {
      while (this.metaTagsTrans.length > 0) {
        this.metaTagsTrans.removeAt(0);
      }
    }
    this.webPositioningService
      .getCurrentEnterprisePageInfo(this.page)
      .subscribe(info => {
        if (!info) {
          this.langs.forEach(u => {
            let ctrl = this.formBuilder.group({
              id: null,
              langCodeId: u.id,
              langCode: u.code,
              title: null,
              description: null
            });
            this.metaTagsTrans.push(ctrl);
          })
        } else {
          this.webPositioningForm.patchValue(info);
          this.langs.forEach(u => {
            const obj = info.metaTagsTrans.find(v => v.langCodeId === u.id);
            let ctrl = this.formBuilder.group({
              id: obj ? obj.id : null,
              langCodeId: u.id,
              langCode: u.code,
              title: obj ? obj.title : null,
              description: obj ? obj.description : null
            });
            this.metaTagsTrans.push(ctrl);
          })
        }
        this.selectedTab = this.langs.findIndex(u => u.code === this.translateService.currentLang);
      });
  }
}
