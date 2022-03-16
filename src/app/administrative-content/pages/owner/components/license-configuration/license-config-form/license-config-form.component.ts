import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LicenseConfigurationService} from '../../../../../../shared/services/license-configuration.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LicenseServiceService} from '../../../../../../shared/services/license-service.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Module, MODULES} from './modules';
import _ from 'lodash';

@Component({
  selector: 'app-license-config-form',
  templateUrl: './license-config-form.component.html',
  styleUrls: ['./license-config-form.component.scss']
})
export class LicenseConfigFormComponent implements OnInit {
  modules: Module[] = _.cloneDeep(MODULES);

  licenseForm: FormGroup;
  searchCodeLoadding = false;
  // tokenError = false;
  msgError: string;
  bodyLicense;
  PRODUCT_CODE = 'ecommerce';

  constructor(
    // private rxStomp: StompService,
    private licenseService: LicenseServiceService,
    private fb: FormBuilder,
    private licenseConfigService: LicenseConfigurationService,
    private matDialogRef: MatDialogRef<LicenseConfigFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private matSnackbar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.licenseForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      description: null,
      maxOperators: [null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]*$/)])],
      startDate: [null, Validators.required],
      expirationDate: [null, Validators.required],
    });
    if (this.data.editMode) {
      this.licenseForm.patchValue({
        id: this.data.license.id,
        name: this.data.license.name,
        startDate: this.data.license.startDate,
        expirationDate: this.data.license.expirationDate,
        description: this.data.license.description,
        maxOperators: this.data.license.maxOperators
      });
      // this.modules.forEach(u => {
      //   u.checked = this.data.license.authorities.some(v => v === u.value);
      // });

      this.modules.forEach(u => {
        if (!u.children) {
          if (this.data.license.authorities.some(v => u.value === v)) {
            u.selected = true;
          }
        } else {
          u.children.forEach(w => {
            if (this.data.license.authorities.some(x => w.value === x)) {
              w.selected = true;
            }
          });
          if (u.children.filter(c => c.selected).length === u.children.length) {
            u.selected = true;
          }
        }
      });
    }
  }

  // private initLicenseForm() {
  //   this.licenseForm.get('maxOperators').setValue('');
  //   this.licenseForm.get('startDate').setValue('');
  //   this.licenseForm.get('expirationDate').setValue('');
  //   this.modules.map(e => e.checked = false);
  // }

  // saveAuth() {
  //   if (this.licenseForm.invalid) {
  //     return;
  //   }
  //   const req = {
  //     ...this.licenseForm.value,
  //     authorities: this.modules.filter(e => e.checked).map(u => u.value)
  //   };
  //   console.log(req);
  //   this.licenseConfigService.save(req).subscribe(() => {
  //     this.matDialogRef.close(true);
  //   }, (err: HttpErrorResponse) => {
  //     this.matSnackbar.open('Configuration name already exists', 'Ok', {duration: 3000});
  //   });
  // }

  save() {
    if (this.licenseForm.invalid) {
      return;
    }
    const authorities = _.flatten(this.modules.map(u => {
      if (!u.children) {
        return u;
      }
      return [...u.children];
    })).filter(u => u.selected).map(u => u.value);
    const req = {...this.licenseForm.value, authorities};
    this.licenseConfigService.save(req).subscribe(() => {
      this.matDialogRef.close(true);
    }, (err: HttpErrorResponse) => {
      this.matSnackbar.open('Configuration name already exists', 'Ok', {duration: 3000});
    });
  }


  descendantsAllSelected(m: any) {
    if (!m.children) {
      return false;
    }
    return m.children.filter(u => u.selected).length === m.children.length;
  }

  descendantsPartiallySelected(m: any) {
    if (!m.children) {
      return false;
    }
    return m.children.some(u => u.selected) && !this.descendantsAllSelected(m);
  }

  selectedAllDescendants(m: any) {
    if (!m.children) {
      return;
    }
    if (m.selected) {
      m.children.forEach(u => u.selected = true);
    } else {
      m.children.forEach(u => u.selected = false);
    }
  }
}
