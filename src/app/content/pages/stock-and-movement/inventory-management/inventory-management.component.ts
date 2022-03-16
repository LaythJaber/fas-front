import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Inventory} from '../../../../shared/models/Inventory';
import {MatDialog, MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {MovementMgmService} from '../../../../shared/services/movement-mgm.service';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {TranslateService} from '@ngx-translate/core';
import {InventoryManagementFormComponent} from './inventory-management-form/inventory-management-form.component';
import {LocalStorageService} from 'ngx-webstorage';
import * as moment from 'moment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.scss']
})
export class InventoryManagementComponent implements OnInit {

  columns = [
    'MOVEMENT_FORM.DATE',
    'MOVEMENT_FORM.NUMBER',
    'MOVEMENT_FORM.NOTE',
    'MOVEMENT_FORM.DRAFT',
  ];
  loading = true;
  firstCall = true;
  rows: Inventory[] = [];
  searchFormControl: FormGroup;
  public page = 1;
  public totalRecords: number;
  public pageSize = 10;
  lastInvId: number;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];

  constructor(
    public snackBar: MatSnackBar,
    private http: HttpClient,
    private breadcrumbService: BreadcrumbService,
    public dialog: MatDialog,
    private movementMgmService: MovementMgmService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private matDialog: MatDialog,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.resetSearchForm();
    this.breadcrumbService.sendBreadcrumb(['MOVEMENT_AND_STOCK', 'INVENTORY']);
  }

  delete($event, el: Inventory): void {
    $event.cancelBubble = true;
    $event.stopPropagation();
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE'))
      .then(res => {
        if (res.value) {
          this.movementMgmService.deleteInventory(el.id).subscribe(r => {


            this.search();
          }, err => {
            if (err.status === 500) {

            }
          });
        }
      });
  }


  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['MOVEMENT_AND_STOCK', 'INVENTORY']);
  }

  edit(inventory, i) {
    this.router.navigate(['/inventory-mgm/inventory', inventory.id]);
    // const dialogRef = this.matDialog.open(InventoryManagementFormComponent, {
    //   width: '90%',
    //   height: '90vh',
    //   autoFocus: true,
    //   disableClose: false,
    //   data: {editMode: true, inventory}
    // });
    // dialogRef.afterClosed().subscribe((response: any) => {
    //   this.pageChange(this.page);
    // });
  }

  addNew() {
    this.router.navigate(['/inventory-mgm/inventory']);
    // const dialogRef = this.matDialog.open(InventoryManagementFormComponent, {
    //   width: '90%',
    //   height: '90vh',
    //   autoFocus: true,
    //   disableClose: false,
    //   data: {editMode: false}
    // });
    // dialogRef.afterClosed().subscribe((response: any) => {
    //   this.pageChange(this.page);
    // });
  }


  search() {
    this.lastInvId = null;
    const request = {
      page: this.page,
      pageSize: this.pageSize,
      number: null,
      dateFrom: this.searchFormControl.get('dateFrom').value ?
        moment(this.searchFormControl.get('dateFrom').value).format('YYYY-MM-DD') : '',
      dateTo: this.searchFormControl.get('dateTo').value ?
        moment(this.searchFormControl.get('dateTo').value).format('YYYY-MM-DD') : '',
    };
    this.loading = true;
    // this.movementMgmService.getLastInventoryId().subscribe(r => {
    //   this.lastInvId = r;
    // });
    return this.movementMgmService.searchInventory(request).subscribe(data => {
      this.rows = data.data;
      this.loading = false;
      this.firstCall = false;
      this.totalRecords = data.totalRecords;
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.search();
  }

  resetSearchForm() {
    this.searchFormControl = new FormGroup({
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
    });
    this.filter();
  }

  filter() {
    this.page = 1;
    this.search();
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }

}
