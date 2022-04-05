import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {GroupFormModalComponent} from './group-form-modal/group-form-modal.component';
import {Group, GroupWithSuperAdmins} from '../../../../../shared/models/group';
import {OwnerService} from '../../../../../shared/services/owner.service';
import {Account} from '../../../../../shared/models/account.model';
import {FeatureNode, TREE_DATA} from '../../../../../shared/const/authorities';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SuperAdminMgmFormComponent} from './super-admin-mgm-form/super-admin-mgm-form.component';
import * as Swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {UserService} from '../../../../../shared/services/user.service';
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {ClientPageRequest} from '../../../../../shared/dto/client-page-request';
import {SuperAdminService} from "../../../../../shared/services/super-admin.service";


@Component({
  selector: 'app-group-mgm',
  templateUrl: './group-mgm.component.html',
  styleUrls: ['./group-mgm.component.scss']
})
export class GroupMgmComponent implements OnInit {
  groups: GroupWithSuperAdmins[] = [];
  features: FeatureNode[];
  selectedGroupIndex: number;
  superAdmins: Account[] = [];
  showSaveFeatureButton = false;
  loadedGroup: Group;
  openedPanel;
  tableColumns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.USERNAME',
    'DATA_TABLE.FIRST_NAME',
    'DATA_TABLE.LAST_NAME',
    'DATA_TABLE.MOBILE',
  ];
  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.DATE',
    'DATA_TABLE.FIRST_NAME',
    'DATA_TABLE.DESCRIPTION',
    'ADMIN.GROUP.EXPIRED',
    'ADMIN.GROUP.VERIFIED',
  ];

  request: ClientPageRequest;
  filterForm = new FormGroup({
    search: new FormControl(null),
    active: new FormControl(null),
    expired: new FormControl(null),
    confirmed: new FormControl(null),
    licenseConfigId: new FormControl(null),
    from: new FormControl(null),
    to: new FormControl(null),
  });
  loading = false;
  isNew = false;
  licenseConfigs: any[];
  panelOpenState;
  pageSize = 10;
  page = 1;
  modalRef: any;
  selectedGrp: GroupWithSuperAdmins;
  showFilter = false;


  constructor(
    private matDialog: MatDialog,
    private ownerService: OwnerService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService,
    private router: Router,
    private userService: UserService,
    private superAdminService: SuperAdminService,
    ) {
  }

  ngOnInit() {
    this.panelOpenState = false;
    // this.loadGroups();
  //  this.lazySearch();
    this.loadSuperAdmins();
    this.features = TREE_DATA;
    this.filterForm.valueChanges.subscribe(() => {
      // this.loadGroups();
      this.lazySearch();
    });
  }

  openAddGroupForm() {
    this.matDialog.open(SuperAdminMgmFormComponent, {
      closeOnNavigation: true,
      disableClose: true,
      width: '800px',
      data: {editMode: false}
    }).afterClosed().subscribe(d => {
      if (d) {
        this.page = 1;
        this.filterForm.reset({search: null, active: null, expired: null}, {emitEvent: false});
        // this.loadGroups(true);
        this.lazySearch(true);
      }
    });

  }

  /*openAddSuperAdminsModal(group) {
    this.matDialog.open(SuperAdminsModalComponent, {
      disableClose: false,
      width: '500px',
      hasBackdrop: true,
      data: {groupId: group.id, superAdmins: group.superAdmins.map(e => e.id)}
    }).afterClosed().subscribe(d => {
      if (d) {
        this.loadGroups();
      }
    });
  }

  loadGroupData(group, index) {
    this.selectedGroupIndex = index;
    this.ownerService.getSuperAdminsByGroup(group.id).subscribe(d => {
      this.superAdmins = d;
    });
    this.ownerService.getGroupById(group.id).subscribe(d => {
      this.loadedGroup = d;
      this.resetFeatures();
      this.setCheckedFeatures(d.features);
    });
  }*/

  deleteGroup(g: GroupWithSuperAdmins, $event: MouseEvent) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    Swal.default.fire({
      icon: 'warning',
      titleText: this.translateService.instant('OWNER.DELETE_ADMIN'),
      html: this.translateService.instant('OWNER.DELETE_CONFIRM', {name: `${g.name}`}),
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('BUTTONS.CANCEL')
    }).then(e => {
      if (e.value) {
        this.ownerService.deleteGroup(g.id).subscribe(d => {
          // this.loadGroups();
          this.lazySearch();
        }, (err: HttpErrorResponse) => {
          if (err.error.message.includes('ConstraintViolationException')) {
            this.matSnackBar.open(this.translateService.instant('ERROR'), 'Ok', {
              duration: 5000,
              panelClass: 'white-snackbar',
            });
          }
        });
      }
    });
  }

  openEditGroupForm(g: GroupWithSuperAdmins, $event: MouseEvent) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.matDialog.open(GroupFormModalComponent, {
      width: '500px',
      disableClose: false,
      data: {editMode: true, group: g}
    }).afterClosed().subscribe(d => {
      if (d) {
        // this.loadGroups();
        this.lazySearch();
      }
    });
  }


  lazySearch(openEditDuration?: boolean) {
    this.loading = true;
    const request = {
      ...this.filterForm.value,
      page: this.page,
      pageSize: this.pageSize,
      from: this.filterForm.value.from !== null ? moment(this.filterForm.value.from).format('YYYY-MM-DD') : null,
      to: this.filterForm.value.to !== null ? moment(this.filterForm.value.to).format('YYYY-MM-DD') : null,
    };
    this.ownerService.lazySearch(request).subscribe(res => {
      this.groups = res.data;
      this.loading = false;
      console.log(openEditDuration);
      if (openEditDuration) {
        this.openDateMgmForm(res[0]);
      }
    });
  }

  loadGroups(openEditDuration?: boolean) {
    this.loading = true;
    const request = {
      ...this.filterForm.value,
      from: moment(this.filterForm.value.from).format('YYYY-MM-DD'),
      to: moment(this.filterForm.value.to).format('YYYY-MM-DD'),
    };
    this.ownerService.getAllGroups(this.filterForm.value).subscribe(res => {
      this.groups = res;
      this.loading = false;
      console.log(openEditDuration);
      if (openEditDuration) {
        this.openDateMgmForm(res[0]);
      }
    });
  }

  /*showSaveFeatureBtn($event) {
    this.showSaveFeatureButton = $event;
  }

  saveFeatureToGroup() {
    this.ownerService.setGroupAuthorities({groupId: this.loadedGroup.id, features: this.getCheckedFeatures()}).subscribe(d => {
      this.showSaveFeatureButton = false;
      this.matSnackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok', {duration: 5000});
    });
    // this.getCheckedFeatures();
  }*/

  private setCheckedFeatures(selectedFeatures: string[]) {
    if (selectedFeatures.length === 0) {
      this.resetFeatures();
      return;
    }
    selectedFeatures.forEach(d => {
      this.features.forEach(e => {
        const child0 = e.children[0];
        const child1 = e.children[1];
        if (child0.value === d) {
          e.children[0].checked = true;
        }
        if (child1.value === d) {
          e.children[1].checked = true;
        }
        e.checked = e.children[0].checked && e.children[1].checked;
        e.indeterminate = (e.children[0].checked || e.children[1].checked) && !(e.children[0].checked && e.children[1].checked);
      });
    });
  }

  private getCheckedFeatures() {
    return this.features
      .filter(e => e.children.findIndex(u => u.checked) > -1)
      .map(e => e.children)
      .reduce((a, b) => a.concat(b), [])
      .filter(e => e.checked)
      .map(e => e.value);
  }

  private resetFeatures() {
    this.showSaveFeatureButton = false;
    this.features.forEach(e => {
      e.checked = false;
      e.indeterminate = false;
      e.expand = false;
      e.children.forEach(d => d.checked = false);
    });
  }

  setLastOpenedPanel(i: number) {
    this.openedPanel = i;
  }

  openSuperAdminMgmFormDialog(acc?: Account) {
    const dialogRef = this.matDialog.open(SuperAdminMgmFormComponent, {
      closeOnNavigation: true,
      disableClose: true,
      width: '700px',
      data: {
        account: acc,
      }
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        // this.loadGroups();
        this.loadSuperAdmins();
      }
    });
  }

  deleteSuperAdmin(a) {
    Swal.default.fire({
      icon: 'warning',
      titleText: this.translateService.instant('OWNER.DELETE_ADMIN'),
      html: this.translateService.instant('OWNER.DELETE_CONFIRM', {name: `${a.firstName} ${a.lastName}`}),
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('BUTTONS.CANCEL')
    }).then(e => {
      if (e.value) {
        this.ownerService.deleteSuperAdmin(a.id).subscribe(d => {
          // this.loadGroups();
          this.loadSuperAdmins();

        }, (err: HttpErrorResponse) => {
          if (err.error.message.includes('ConstraintViolationException')) {
            this.matSnackBar.open(this.translateService.instant('ADMIN.GROUP.CANNOT_DELETE_SUPER_ADMIN'), 'Ok', {
              duration: 5000,
              panelClass: 'white-snackbar',
            });
          }
        });
      }
    });
  }

  toggleActivation(g: GroupWithSuperAdmins, $event: MouseEvent) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.ownerService.toggleGroupActivation(g.id).subscribe(d => {
      // this.loadGroups();
      this.lazySearch();
    });
  }

  navigateToGroup(g: GroupWithSuperAdmins, $event: MouseEvent) {
    $event.stopPropagation();
    $event.cancelBubble = true;
    const tokenStorageKey = 'authenticationToken';
    this.ownerService.chooseGroup(g.id).subscribe(resp => {
      if (this.$localStorage.retrieve(tokenStorageKey)) {
        this.$localStorage.store(tokenStorageKey, resp.token);
      } else {
        this.$sessionStorage.store(tokenStorageKey, resp.token);
      }
      this.userService.fetch().subscribe(u => {
        if (this.$localStorage.retrieve(tokenStorageKey)) {
          this.$localStorage.store('user', u);
        } else {
          this.$sessionStorage.store('user', u);
        }
      });
      this.router.navigate(['/admin']);
    });
  }

  openDateMgmForm(g: GroupWithSuperAdmins, $event?: MouseEvent) {
    if ($event) {
      $event.stopPropagation();
      $event.cancelBubble = true;
    }
    // this.matDialog.open(DateMgmFormModalComponent, {
    //   disableClose: true,
    //   data: {group: g}
    // }).afterClosed().subscribe(u => {
    //   if (u) {
    //     this.loadGroups();
    //   }
    // });
  }

  pageChange($event) {
    this.page = $event;
    this.lazySearch();
  }

  showGrpAdmin(superAdminContent, g: GroupWithSuperAdmins, $event: MouseEvent) {
    this.selectedGrp = g;
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.modalRef = this.matDialog.open(superAdminContent, {
      disableClose: true,
    }).afterClosed().subscribe(u => {
      this.lazySearch();
    });
  }

 loadSuperAdmins() {
   this.superAdminService.get().subscribe( response => {
     this.superAdmins = response;
   })
 }

  resetFilter() {
    this.filterForm.reset();
    this.page = 1;
    this.lazySearch();
  }

  showHideFilter() {
    this.showFilter = !this.showFilter;
  }
}

