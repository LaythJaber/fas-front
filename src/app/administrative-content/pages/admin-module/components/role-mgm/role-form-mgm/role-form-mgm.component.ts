import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RoleService} from '../../../../../../shared/services/role.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SweetAlertService} from '../../../../../../shared/services/sweet-alert.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-role-form-mgm',
  templateUrl: './role-form-mgm.component.html',
  styleUrls: ['./role-form-mgm.component.scss']
})
export class RoleFormMgmComponent implements OnInit {
  roleForm: FormGroup;
  submitted = false;
  disableSaveBtn = false;

  constructor(
    private roleService: RoleService,
    private matDialogRef: MatDialogRef<RoleFormMgmComponent>,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.roleForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      authorities: new FormControl()
    });
    console.log(this.data);
    if (this.data.editMode) {
      this.roleForm.patchValue(this.data.role);
    }
  }

  saveRole() {
    this.submitted = true;
    if (!this.roleForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    if (!this.data.editMode) {
      this.disableSaveBtn = true;
      this.roleService.addRole(this.roleForm.value).subscribe(d => {
        if (d.status === 200) {
          this.matDialogRef.close(true);
        } else {
          this.disableSaveBtn = false;
        }
      });
    } else {
      this.disableSaveBtn = true;
      this.roleService.editRole(this.roleForm.value).subscribe(d => {
        if (d.status === 200) {
          this.matDialogRef.close(true);
        } else {
          this.disableSaveBtn = false;
        }
      });
    }
  }
}
