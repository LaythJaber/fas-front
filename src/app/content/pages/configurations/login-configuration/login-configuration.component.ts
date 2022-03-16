import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoginConfigurationService} from '../../../../shared/services/login-configuration.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-login-configuration',
  templateUrl: './login-configuration.component.html',
  styleUrls: ['./login-configuration.component.scss']
})
export class LoginConfigurationComponent implements OnInit {
  loginConfigurationForm: FormGroup;
  columns = ['Campi personalizzabili', 'Descrizione', 'Visibile', 'Required'];

  constructor(
    private fb: FormBuilder,
    private loginConfigurationService: LoginConfigurationService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    this.loginConfigurationForm = this.fb.group({
      id: null,
      loginWithFacebook: null,
      loginWithGoogle: null,
      loginRequired: null,
      registrationConfirmationType: 'AUTO',
      pricesVisibleByAnonymous: null,
      customField1Name: null,
      activeCustomField1: null,
      requiredCustomField1: null,
      customField2Name: null,
      activeCustomField2: null,
      requiredCustomField2: null,
      customField3Name: null,
      activeCustomField3: null,
      requiredCustomField3: null,
      customField4Name: null,
      activeCustomField4: null,
      requiredCustomField4: null,
    });
    this.loginConfigurationService.getCurrentGroupConfig().subscribe(res => {
      this.loginConfigurationForm.patchValue(res);
    });
  }

  save() {
    if (this.loginConfigurationForm.invalid) {
      this.sweetAlertService.danger(this.translate.instant('DIALOG.INVALID_PARAM'));
      return;
    }
    this.loginConfigurationService.update(this.loginConfigurationForm.value).subscribe(() => {
      this.matSnackBar.open(
        this.translateService.instant('LOGIN_CONFIGURATION.UPDATED_SUCCESS'),
        'Ok',
        {duration: 1500}
      );
    });
  }
}
