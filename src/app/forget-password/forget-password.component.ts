import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { TranslationLoaderService } from '../core/services/translation-loader.service';
import { RecoverPasswordService } from '../shared/services/recover-password.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  usernameForm: FormControl;
  loading = false;
  done = false;
  constructor(
    private recoverPasswordService: RecoverPasswordService,
    public translationLoaderService: TranslationLoaderService,
    private dateAdapter: DateAdapter<any>,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.usernameForm = new FormControl(null, Validators.required);
  }

  recoverPassword() {
    if (this.usernameForm.invalid || this.loading) {
      return;
    }
    this.loading = true;
    this.recoverPasswordService.recoverPassword(this.usernameForm.value).pipe(finalize(() => this.loading = false)).subscribe(d => {
      this.done = d;
    });
  }

  changeLang(lang: 'en' | 'it' | 'fr') {
    this.translationLoaderService.setLanguage(lang);
    this.dateAdapter.setLocale(lang);
  }
}
