import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Language} from "../../../../shared/models/language";
import {LanguageService} from "../../../../shared/services/language.service";
import {TranslateService} from "@ngx-translate/core";
import {AppMobileService} from "../../../../shared/services/mobile/app-mobile.service";
import {
  AppMobileConfiguration,
  AppMobileConfigurationTranslation
} from "../../../../shared/models/mobile/app-mobile-configuration";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-update-app-configuration',
  templateUrl: './update-app-configuration.component.html',
  styleUrls: ['./update-app-configuration.component.scss']
})
export class UpdateAppConfigurationComponent implements OnInit {

  appMobileConfig: AppMobileConfiguration;
  appMobileConfigForm: FormGroup;

  selectedTab: number;
  languageList: Language[];

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private appMobileService: AppMobileService,
    private matSnackBar: MatSnackBar
  ) {
    this.initForms();
    this.getLanguageList();
  }

  ngOnInit() {
  }

  initForms() {
    this.appMobileConfigForm = new FormGroup({
      id: new FormControl(null),
      androidVersionNumber: new FormControl(null),
      androidObligatory: new FormControl(false),
      iosVersionNumber: new FormControl(null),
      iosObligatory: new FormControl(false),
    });
  }

  getLanguageList() {
    this.languageService.getLanguages().subscribe(r => {
      this.languageList = r;
      this.selectedTab = this.languageList.findIndex(u => u.code === this.translateService.currentLang);
      this.initTransInfoArrayForm();
      this.getCurrentAppMobileConfiguration();
    });
  }

  initTransInfoArrayForm(trans: AppMobileConfigurationTranslation[] = []) {
    this.appMobileConfigForm.removeControl('transInfo');
    const transInfo = this.fb.array(
      this.languageList.map(l => {
        const obj = trans.find(t => t.language.code == l.code);
        return new FormGroup({
          id: new FormControl(obj ? obj.id : null),
          language: new FormControl({id: l.id, code: l.code}),
          description: new FormControl(obj ? obj.description : null),
          titleOblig: new FormControl(obj ? obj.titleOblig : null),
          descriptionOblig: new FormControl(obj ? obj.descriptionOblig : null),
          titleFacultatif: new FormControl(obj ? obj.titleFacultatif : null),
          descriptionFacultatif: new FormControl(obj ? obj.descriptionFacultatif : null),
        });
      })
    );
    this.appMobileConfigForm.addControl('transInfo', transInfo);
  }


  getCurrentAppMobileConfiguration() {
    this.appMobileService.getCurrentAppMobileConfiguration().subscribe((response) => {
      this.appMobileConfig = response;
      this.appMobileConfigForm.patchValue(this.appMobileConfig);
      this.initTransInfoArrayForm(this.appMobileConfig.transInfo);
    });
  }

  updateAppMobileConfiguration() {
    let request: AppMobileConfiguration = {
      ...this.appMobileConfigForm.getRawValue()
    }
    this.appMobileService.updateAppMobileConfiguration(request).subscribe((response) => {
      this.matSnackBar.open(this.translateService.instant('ADMIN.GROUP.UPDATED_SUCCESS'), 'Ok', {duration: 5000});
      this.getCurrentAppMobileConfiguration();
    }, () => {
      this.matSnackBar.open(this.translateService.instant('DIALOG.CANNOT_UPDATE'), 'Ok', {duration: 5000});
    });
  }

}
