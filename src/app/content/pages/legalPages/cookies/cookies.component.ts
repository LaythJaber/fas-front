import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {TranslateService} from "@ngx-translate/core";
import {Page1Service} from "../../../../shared/services/page1.service";
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";
import {CookiesService} from "../../../../shared/services/cookies.service";
import {Language} from "../../../../shared/enum/language.enum";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {Page} from "../../../../shared/models/page";
import {Cookie} from "../../../../shared/models/cookie";

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {
  languages=[];
  unsubscribe$ = new Subject();
  data: Cookie;
  legalPage: FormGroup;
  config = {
    language: 'it'
  };

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              private cookiesService: CookiesService,
              private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.translateLanguages();
    this.legalPage = this.fb.group({
      id: new FormControl(),
      name: new FormControl(),
      active: new FormControl(),
      htmlContent: new FormControl(),
      langEnum: new FormControl()
    });
    this.cookiesService.get().subscribe(r=>{
      this.data=r;
      console.log(this.data);
      this.legalPage.patchValue(r);
      const lang= this.translateService.getDefaultLang();
      console.log(lang);
      this.mapTransInfo(r, lang);
    });
    this.legalPage.get('langEnum').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(d => {
      this.mapTransInfo(this.data, d);
    });
  }

  mapTransInfo(r, lang){
    console.log(r);
    const trans= r.transInfo.filter(
      u => u.langEnum.toString() === lang)[0];
    console.log(trans);
    this.legalPage.get('langEnum').setValue(lang  , { emitEvent: false })
    if(trans) {
      this.legalPage.get('name').setValue(trans.name);
      this.legalPage.get('htmlContent').setValue(trans.htmlContent);
    }else {
      this.legalPage.get('name').setValue(null);
      this.legalPage.get('htmlContent').setValue(null);
    }
  }

  save(){
    this.cookiesService.update(this.legalPage.getRawValue()).subscribe(r=>{
      console.log("updated");
    });
  }

  translateLanguages(){
    this.languages = [{ description: Language.en, id: Language.en },
      { description: Language.es, id: Language.es },
      { description: Language.fr, id: Language.fr },
      { description: Language.it, id: Language.it }];
  }
}
