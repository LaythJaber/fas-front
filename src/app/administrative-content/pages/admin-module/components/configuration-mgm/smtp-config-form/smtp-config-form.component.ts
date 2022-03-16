import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SmtpConfigurationService } from "../../../../../../shared/services/smtp-configuration.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { of } from "rxjs";
import * as Swal from 'sweetalert2';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';

@Component({
  selector: 'app-smtp-config-form',
  templateUrl: './smtp-config-form.component.html',
  styleUrls: ['./smtp-config-form.component.scss']
})
export class SmtpConfigFormComponent implements OnInit {
  smtpConfigForm: FormGroup;
  loading: boolean;
  fieldTextType: boolean;

  constructor(
    private fb: FormBuilder,
    private smtpConfigurationService: SmtpConfigurationService,
    private matSnackBar: MatSnackBar,
    private sweetAlert: SweetAlertService
  ) { }

  ngOnInit() {
    this.smtpConfigForm = this.fb.group({
      host: [null, Validators.required],
      port: [null, Validators.required],
      password: [null, Validators.required],
      username: [null, Validators.required],
    });
    this.smtpConfigurationService
      .getCurrentGroupConfig()
      .pipe(catchError((e: HttpErrorResponse) => {
        if (e.status === 404) {
          return of(null)
        }
        return of(e);
      }))
      .subscribe(res => {
        if (res) {
          this.smtpConfigForm.patchValue(res);
        }
      })
  }

  saveSmtpConfig() {
    console.log(this.smtpConfigForm.value);
    if (this.smtpConfigForm.invalid) {
      return;
    }
    this.smtpConfigurationService.updateConfig(this.smtpConfigForm.value)
      .subscribe(res => {
        this.matSnackBar.open('Config updated successfully ⚡', 'Ok', { duration: 1500 });
      });
  }

  testConnection() {
    if (this.smtpConfigForm.invalid) {
      return;
    }
    this.loading = true;
    this.smtpConfigurationService.testConnection(this.smtpConfigForm.value)
      .subscribe(res => {
        this.loading = false;
        if ("VALID_PARAMS" == res) {
          this.sweetAlert.success('Parametri Validi');
        }
        else {
          this.sweetAlert.danger(res || 'Gateway Time-out');
        } }, err => {
        console.log(err.error.text);
        this.loading = false;
        if ("VALID_PARAMS" == err.error.text) {
          this.sweetAlert.success('Parametri Validi');
        }
        else {
          this.sweetAlert.danger(err.error.text || 'Gateway Time-out');
        }
      });
  }


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }


}
