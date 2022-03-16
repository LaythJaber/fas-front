import {Component, OnInit} from '@angular/core';
import {LanguageService} from "../../../../shared/services/language.service";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {MultimediaService} from "../../../../shared/services/multimedia.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {Language} from "../../../../shared/models/language";

@Component({
  selector: 'app-login-settings',
  templateUrl: './login-settings.component.html',
  styleUrls: ['./login-settings.component.scss']
})
export class LoginSettingsComponent implements OnInit {
  loginSettingsForm: FormGroup;
  langs: Language[];
  constructor(
    private languageService: LanguageService,
    private formBuilder: FormBuilder,
    private multimediaService: MultimediaService,
    private matSnackbar: MatSnackBar,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.loadLoginMultimedia();
  }

  buildForm() {
    this.loginSettingsForm = this.formBuilder.group({
      transInfo: this.formBuilder.array([]),
    });
  }

  get transInfo() {
    return this.loginSettingsForm.get('transInfo') as FormArray
  }

  save() {
    this.multimediaService.updateLoginMultimedia(this.loginSettingsForm.value)
      .subscribe(() =>
        this.matSnackbar.open(this.translateService.instant('MULTIMEDIA.UPDATED_SUCCESS'), 'Ok', {duration: 1500})
      , error => this.matSnackbar.open(this.translateService.instant('MULTIMEDIA.INTERNAL_SERVER_ERROR'), 'Ok'))
  }

  private loadLoginMultimedia() {
    this.buildForm();
    this.multimediaService.getCurrentLoginMultimedia().subscribe(res => {
      if (!res) {
        this.languageService.getLanguages().subscribe(langs => {
          this.langs = langs;
          langs.forEach(lang => {
            const transInfo = this.formBuilder.group({
              id: null,
              langCodeId: lang.id,
              langCode: lang.code,
              loginLabel: null,
              loginButton: null,
              registrationBoxLabel: null,
              registrationBoxButton: null,
              registrationBoxTitle: null,
              registrationBoxSubtitle: null,
            });
            this.transInfo.push(transInfo);
          });
        });
      } else {
        while (this.transInfo.length > 0) {
          this.transInfo.removeAt(0);
        }
        this.languageService.getLanguages().subscribe(langs => {
          this.langs = langs;
          langs.forEach(lang => {
            const obj = res.transInfo.find(v => v.langCodeId === lang.id);
            const transInfo = this.formBuilder.group({
              id: obj ? obj.id : null,
              langCodeId: lang.id,
              langCode: lang.code,
              loginLabel: obj ? obj.loginLabel : null,
              loginButton: obj ? obj.loginButton : null,
              registrationBoxLabel: obj ? obj.registrationBoxLabel : null,
              registrationBoxButton: obj ? obj.registrationBoxButton : null,
              registrationBoxTitle: obj ? obj.registrationBoxTitle : null,
              registrationBoxSubtitle: obj ? obj.registrationBoxSubtitle : null,
            });
            this.transInfo.push(transInfo);
          });
        });
      }
    })
  }
}
