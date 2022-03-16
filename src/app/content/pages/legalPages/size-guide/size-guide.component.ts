import { Component, OnInit } from '@angular/core';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {Subject} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {Language} from '../../../../shared/enum/language.enum';
import {SizeGuidePageService} from '../../../../shared/services/size-guide-page.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SizeGuidePage} from '../../../../shared/models/size-guide-page';

@Component({
  selector: 'app-size-guide',
  templateUrl: './size-guide.component.html',
  styleUrls: ['./size-guide.component.scss']
})
export class SizeGuideComponent implements OnInit {
  languages = [];
  unsubscribe$ = new Subject();
  data: SizeGuidePage;
  legalPage: FormGroup;

  config = {
    language: 'it'
  };

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private sizeGuidePageService: SizeGuidePageService,
    private translateService: TranslateService,
    private breadcrumbService: BreadcrumbService,
    private snackBar: MatSnackBar,
  ) {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'SIZE_GUIDE']);
  }

  ngOnInit() {
    this.translateLanguages();
    this.legalPage = this.fb.group({
      id: new FormControl(),
      name: new FormControl(),
      active: new FormControl(),
      htmlContent: new FormControl(),
      langEnum: new FormControl()
    });
    this.getSizeGuidePage();
    this.legalPage.get('langEnum').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(d => {
      this.mapTransInfo(this.data, d);
    });
  }

  getSizeGuidePage() {
    this.sizeGuidePageService.get().subscribe(r => {
      console.log('data size Page Guide = ', this.data);
      this.legalPage.patchValue(r);
      const lang = this.translateService.getDefaultLang();
      this.mapTransInfo(r, lang);
    });
  }

  mapTransInfo(r, lang) {
    const trans = r.transInfo.filter(u => u.langEnum.toString() === lang)[0];
    console.log('selected trans = ', trans);
    this.legalPage.get('langEnum').setValue(lang  , { emitEvent: false });
    if (trans) {
      this.legalPage.get('name').setValue(trans.name);
      this.legalPage.get('htmlContent').setValue(trans.htmlContent);
    } else {
      this.legalPage.get('name').setValue(null);
      this.legalPage.get('htmlContent').setValue(null);
    }
  }

  save() {
    console.log('request  = ', this.legalPage.getRawValue());
    this.sizeGuidePageService.update(this.legalPage.getRawValue())
      .subscribe(
        (r) => {
          console.log('updated = ', r);
          this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
          this.getSizeGuidePage();
        }, (error) => {
          this.snackBar.open(this.translate.instant('DIALOG.CANNOT_UPDATE'), 'Ok', {duration: 5000});
        });
  }

  translateLanguages() {
    this.languages = [{ description: Language.en, id: Language.en },
      { description: Language.es, id: Language.es },
      { description: Language.fr, id: Language.fr },
      { description: Language.it, id: Language.it }];
  }

}
