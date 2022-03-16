import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {RoleFormMgmComponent} from './role-form-mgm/role-form-mgm.component';
import {RoleService} from '../../../../../shared/services/role.service';
import {AUTHORITIES} from '../../../../../shared/const/authorities';
import {FormArray, FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as Swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';
import _ from 'lodash';
import {OPERATOR_MODULES} from './operator-modules';
import {OwnerService} from '../../../../../shared/services/owner.service';
import {SweetAlertService} from '../../../../../shared/services/sweet-alert.service';

@Component({
  selector: 'app-role-mgm',
  templateUrl: './role-mgm.component.html',
  styleUrls: ['./role-mgm.component.scss']
})
export class RoleMgmComponent implements OnInit, OnDestroy {
  roles: any[] = [];
  authoritiesFormArray: FormArray;
  authorities = AUTHORITIES;
  selectedRole;
  disableAuthoritySave = true;
  unsubscribe = new Subject();
  saveLoading = false;
  authoritiesLoading = false;
  rolesLoading = false;
  selectedRoleIndex;
  modules = _.cloneDeep(OPERATOR_MODULES);

  constructor(
    private matDialog: MatDialog,
    private roleService: RoleService,
    private matSnackBar: MatSnackBar, private ownerService: OwnerService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    // this.rolesLoading = true;
    // this.authoritiesFormArray = this.createAuthoritiesForm(this.authorities);
    // this.roleService.getAllRoles().subscribe(d => {
    //   this.roles = d;
    //   this.rolesLoading = false;
    // });
    // this.authoritiesFormArray.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(s => {
    // });


    this.rolesLoading = true;
    this.ownerService.getCurrentGroupLicenseModules().subscribe(u => {
      this.modules.forEach(t => {
        if (!t.children) {
          if (!u.some(v => t.value === v)) {
            t.disabled = true;
          }
        } else {
          t.children.forEach(w => {
            if (!u.some(x => w.value === x)) {
              w.disabled = true;
            }
          });
          if (t.children.filter(c => c.disabled).length === t.children.length) {
            t.disabled = true;
          }
        }
      });
      // this.authorities = this.modules.filter(v => u.some(x => x === v.value));
      // this.authoritiesFormArray = this.createAuthoritiesForm(this.authorities);
      this.roleService.getAllRoles().subscribe(d => {
        this.roles = d;
        this.rolesLoading = false;
      });
      /*this.authoritiesFormArray.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(s => {
      });*/
    });
  }

  openAddRoleForm() {
    const dialogRef = this.matDialog.open(RoleFormMgmComponent, {disableClose: true, width: '500px', data: {editMode: false}});
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.rolesLoading = true;
        this.authoritiesFormArray = this.createAuthoritiesForm(this.authorities);
        this.roleService.getAllRoles().subscribe(roles => {
          this.roles = roles;
          this.rolesLoading = false;
        });
      }
    });
  }

  openEditRoleForm(role: any, $event) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    const dialogRef = this.matDialog.open(RoleFormMgmComponent, {disableClose: true, width: '500px', data: {editMode: true, role}});
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.rolesLoading = true;
        this.authoritiesFormArray = this.createAuthoritiesForm(this.authorities);
        this.roleService.getAllRoles().subscribe(roles => {
          this.roles = roles;
          this.rolesLoading = false;
        });
      }
    });
  }

  saveAuthorities() {
    this.saveLoading = true;
    this.selectedRole.authorities = _.flatten(this.modules.map(u => {
      if (!u.children) {
        return u;
      }
      return [...u.children];
    })).filter(u => u.selected).map(u => u.value);
    this.roleService.editRole(this.selectedRole).subscribe(d => {
      if (d.status === 200) {
        this.disableAuthoritySave = true;
        this.saveLoading = false;
        this.roles.splice(this.selectedRoleIndex, 1, d.body);
        this.translate.get('ADMIN.ROLE.ROLE_UPDATED').subscribe(s => {
          this.matSnackBar.open(s, 'Ok', {duration: 5000});
        });
      }
    });
  }

  loadRoleAuthorities(role, index, force = false) {
    if (!this.disableAuthoritySave && !force) {
      this.sweetAlertService.warning(this.translate.instant('ADMIN.ROLE.CHANGES_NOT_SAVED'))
        .then(u => {
          if (u.value) {
            if (!this.selectedRole || role.id !== this.selectedRole.id) {
              this.selectedRoleIndex = index;
              this.disableAuthoritySave = true;
              this.authoritiesLoading = true;
              this.roleService.getRoleById(role.id).subscribe(d => {
                this.selectedRole = d;
                this.modules.forEach(e => {
                  if (!e.children) {
                    e.selected = d.authorities.some(v => e.value === v);
                  } else {
                    e.children.forEach(w => {
                      w.selected = d.authorities.some(x => w.value === x);
                    });
                    e.selected = e.children.filter(c => c.selected).length === e.children.length;
                  }
                });
                this.authoritiesLoading = false;
              });
            }
          }
        });
      return;
    }
    if (!this.selectedRole || role.id !== this.selectedRole.id) {
      this.selectedRoleIndex = index;
      this.disableAuthoritySave = true;
      this.authoritiesLoading = true;
      this.roleService.getRoleById(role.id).subscribe(d => {
        this.selectedRole = d;
        this.modules.forEach(u => {
          if (!u.children) {
            u.selected = d.authorities.some(v => u.value === v);
          } else {
            u.children.forEach(w => {
              w.selected = d.authorities.some(x => w.value === x);
            });
            u.selected = u.children.filter(c => c.selected).length === u.children.length;
          }
        });
        this.authoritiesLoading = false;
      });
    }
  }

  // loadRoleAuthorities(role, index) {
  //   if (!this.selectedRole || role.id !== this.selectedRole.id) {
  //     this.selectedRoleIndex = index;
  //     this.disableAuthoritySave = true;
  //     this.authoritiesLoading = true;
  //     this.roleService.getRoleById(role.id).subscribe(d => {
  //       this.selectedRole = d;
  //       this.setupAuthoritiesFormArray(d.authorities);
  //       this.authoritiesLoading = false;
  //     });
  //   }
  // }

  private getSelectedAuthorities(authorities) {
    return authorities
      .map((el, i) => {
        if (el) {
          return this.authorities[i];
        }
      })
      .filter(e => e)
      .map(e => e.value);
  }

  private setupAuthoritiesFormArray(arr) {
    if (arr.length > 0) { // if role has authorities
      // reset authorities to all not selected
      this.authorities = this.authorities.map(e => {
        e.selected = false;
        return e;
      });
      // set selected authorities based on loaded role
      arr.forEach(e => {
        const i = this.authorities.findIndex(auth => auth.value === e);
        if (i > -1) {
          this.authorities[i].selected = true;
        }
      });
      this.authoritiesFormArray.setValue(this.authorities.map(u => u.selected || false));
    } else { // if role has no authorities
      this.authoritiesFormArray.setValue(this.authorities.map(u => false));
    }
  }

  private createAuthoritiesForm(authorities) {
    return new FormArray(authorities.map(au => new FormControl(au.selected || false)));
  }

  stopPropagation($event) {
    $event.cancelBubble = false;
    $event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }


  deleteRole(role: any, i: number, $event: MouseEvent) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.translate.get('ADMIN.ROLE.DELETE_ROLE', {roleName: role.name}).subscribe(title => {
      this.translate.get('ADMIN.ROLE.DELETE_ROLE_MSG', {roleName: role.name}).subscribe(msg => {
        this.translate.get('ADMIN.ROLE.DELETE_ROLE_MSG', {roleName: role.name}).subscribe(err => {
          this.fireAlert(title, msg, err, role, i);
        });
      });
    });
  }

  private fireAlert(title: string | any, msg: string | any, errMsg: string | any, role, i) {
    Swal.default.fire({
      title,
      icon: 'warning',
      text: msg,
      showCancelButton: true,
      confirmButtonColor: '#2B333D',
      cancelButtonColor: '#E38932'
    }).then(e => {
      if (e.value) {
        this.roleService.deleteRole(role.id).subscribe(d =>
            this.roles.splice(i, 1)
          , error => {
            Swal.default.mixin({
              toast: true,
              position: 'bottom-end',
              timer: 4000,
              timerProgressBar: true,
            }).fire({
              icon: 'error',
              showConfirmButton: false,
              title: 'Error',
              text: errMsg
            });
          });
      }
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
      m.children.forEach(u => {
        if (!u.disabled) {
          u.selected = true;
        }
      });
    } else {
      m.children.forEach(u => {
        if (!u.disabled) {
          u.selected = false;
        }
      });
    }
  }
}
