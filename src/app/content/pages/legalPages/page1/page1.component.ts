import { Component, OnInit } from '@angular/core';
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Page1Service} from "../../../../shared/services/page1.service";
import {BreadcrumbService} from "../../../../core/services/breadcrumb.service";
import {CustomSnackBarComponent} from "../../../../shared/compoenent/custom-snack-bar/custom-snack-bar.component";
import {MatSnackBar} from "@angular/material";
import {Language} from "../../../../shared/enum/language.enum";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {Page} from "../../../../shared/models/page";

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {

  legalPage: FormGroup;
  languages=[];
  unsubscribe$ = new Subject();
  data: Page;
  config = {
    language: 'it'
  };

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              private pageService: Page1Service,
              private breadcrumbService: BreadcrumbService,
              public snackBar: MatSnackBar,
              private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.translateLanguages();
    this.legalPage = this.fb.group({
      id: new FormControl(),
      name: new FormControl(),
      active: new FormControl(),
      info: new FormControl(),
      htmlContent: new FormControl(),
      mandatory: new FormControl(),
      langEnum: new FormControl()
    });
    this.pageService.get().subscribe(r=>{
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
      this.legalPage.get('info').setValue(trans.info);
      this.legalPage.get('htmlContent').setValue(trans.htmlContent);
    }else{
      this.legalPage.get('name').setValue(null);
      this.legalPage.get('info').setValue(null);
      this.legalPage.get('htmlContent').setValue(null);
    }
  }

  save(){
    console.log(this.legalPage.getRawValue());
    this.pageService.update(this.legalPage.getRawValue()).subscribe(r=>{
      console.log(r);
      this.breadcrumbService.sendPagesList({name: 'page1', value: this.legalPage.get('name').value});
      console.log("updated");
      this.showSnackBar({
        text: r.name,
        actionIcon: 'save',
        actionMsg: this.translate.instant('DIALOG.UPDATE_SUCCESS')
      });
    });
  }

  showSnackBar(data: any) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data,
      duration: 5000,
      panelClass: 'white-snackbar'
    });
  }

  translateLanguages(){
    this.languages = [{ description: Language.en, id: Language.en },
      { description: Language.es, id: Language.es },
      { description: Language.fr, id: Language.fr },
      { description: Language.it, id: Language.it }];
  }

}
