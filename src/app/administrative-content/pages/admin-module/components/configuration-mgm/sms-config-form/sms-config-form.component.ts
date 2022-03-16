import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {SmsConfigurationService} from '../../../../../../shared/services/sms-configuration.service';

@Component({
  selector: 'app-sms-config-form',
  templateUrl: './sms-config-form.component.html',
  styleUrls: ['./sms-config-form.component.scss']
})
export class SmsConfigFormComponent implements OnInit {
  smsConfigForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private smsConfigurationService: SmsConfigurationService,
    private matSnackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.smsConfigForm = this.fb.group({
      authKey: [null, Validators.required],
      authSecret: [null, Validators.required],
      sender: [null, Validators.required],
    });
    this.smsConfigurationService
      .getCurrentGroupConfig()
      .pipe(catchError((e: HttpErrorResponse) => {
        if (e.status === 404) {
          return of(null);
        }
        return of(e);
      }))
      .subscribe(res => {
        if (res) {
          this.smsConfigForm.patchValue(res);
        }
      });
  }

  saveSmsConfig() {
    console.log(this.smsConfigForm.value);
    if (this.smsConfigForm.invalid) {
      return;
    }
    this.smsConfigurationService.updateConfig(this.smsConfigForm.value)
      .subscribe(res => {
        this.matSnackBar.open('Config updated successfully ⚡', 'Ok', {duration: 1500});
      });
  }

}

class SmsConfig {
  authKey: string;
  authSecret: string;
  sender: string;
}
