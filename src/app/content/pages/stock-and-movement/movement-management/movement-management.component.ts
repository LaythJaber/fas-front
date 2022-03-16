import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ClientPageRequest} from '../../../../shared/dto/client-page-request';
import {SearchResponse} from '../../../../shared/dto/search-response';
import {Client} from '../../../../shared/models/client';
import {debounceTime} from 'rxjs/operators';
import * as Inputmask from 'inputmask';
import {LocalStorageService} from 'ngx-webstorage';
import {Movement} from '../../../../shared/models/movement';
import {MovementMgmService} from '../../../../shared/services/movement-mgm.service';
import {TranslateService} from '@ngx-translate/core';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {MovementType} from '../../../../shared/enum/movement-type';
import * as moment from 'moment';
import {ClientMgmModalComponent} from '../../../../client-mgm/client-mgm-modal/client-mgm-modal.component';
import {MatDialog} from '@angular/material';
import {MovementManagementFormComponent} from './movement-management-form/movement-management-form.component';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-movement-management',
  templateUrl: './movement-management.component.html',
  styleUrls: ['./movement-management.component.scss']
})
export class MovementManagementComponent implements OnInit {
  @ViewChild('createAtElem') createAtElem: ElementRef;
  columns = [
    'DATA_TABLE.CREATION_DATE',
    'MOVEMENT_FORM.DATE',
    'MOVEMENT_FORM.NUMBER',
    'MOVEMENT_FORM.TYPE',
    'Cliente',
    'MOVEMENT_FORM.TOTAL_QUANTITY_PIECE',
    'MOVEMENT_FORM.TOTAL_QUANTITY_KL',
    'MOVEMENT_FORM.TOTAL_QUANTITY_ML',
  ];

  rows: Movement[] = [];
  filterForm: FormGroup;
  request: ClientPageRequest = new ClientPageRequest();
  totalRecords = 0;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  types = [];
  private loading = false;

  constructor(
    private localStorageService: LocalStorageService,
    private movementMgmService: MovementMgmService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private matDialog: MatDialog,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.breadcrumbService.sendBreadcrumb(['MOVEMENT_AND_STOCK', 'MOVEMENT']);
    this.request.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.request.page = 1;
    this.initFilterForm();
    this.filterMvm();
  }

  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      mvmDate: new FormControl(null),
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (text) => {
        this.request.page = 1;
        this.request.textSearch = text;
        this.filterMvm();
      });


    this.filterForm.get('mvmDate').valueChanges.subscribe(
      (d) => {
        this.request.page = 1;
        this.filterMvm();
      });

    this.setDateMask();
  }

  filterMvm() {
    const request = {
      page: this.request.page,
      pageSize: this.request.pageSize,
      number: this.request.textSearch,
      // dateFrom: this.filterForm.get('dateFrom').value ? moment(this.filterForm.get('dateFrom').value).format('YYYY-MM-DD') : '',
      // dateTo: this.filterForm.get('dateFrom').value ? moment(this.filterForm.get('dateFrom').value).format('YYYY-MM-DD') : '',
      mvmDate: this.filterForm.get('mvmDate').value ? moment(this.filterForm.get('mvmDate').value).format('YYYY-MM-DD') : '',
      // type: this.filterForm.get('type').value,
      inventory: false
    };
    this.loading = true;
    return this.movementMgmService.search(request).subscribe(data => {
      this.rows = data.data;
      this.loading = false;
      this.totalRecords = data.totalRecords;
    });
  }


  setDateMask() {
    Inputmask('datetime', {
      inputFormat: 'dd/mm/yyyy',
      placeholder: 'dd/mm/yyyy'
    }).mask(this.createAtElem.nativeElement);
  }

  addNewMvm() {
    this.router.navigate(['/movement-mgm/movement']);
    // const dialogRef = this.matDialog.open(MovementManagementFormComponent, {
    //   width: '90%',
    //   height: '90vh',
    //   autoFocus: true,
    //   disableClose: false,
    //   data: {editMode: false}
    // });
    // dialogRef.afterClosed().subscribe((response: any) => {
    //   this.pageChange(1);
    // });
  }


  pageChange($event) {
    this.request.page = $event;
    this.filterMvm();
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.request.pageSize);
    this.pageChange(1);
  }

  translateTypes() {
    this.types = [{description: this.translate.instant('MOVEMENT_FORM.' + MovementType.LOAD), id: MovementType.LOAD},
      {description: this.translate.instant('MOVEMENT_FORM.' + MovementType.UNLOAD), id: MovementType.UNLOAD},
      {description: this.translate.instant('MOVEMENT_FORM.' + MovementType.SALE), id: MovementType.SALE},
      {description: this.translate.instant('MOVEMENT_FORM.' + MovementType.RESE), id: MovementType.RESE}];
  }



  edit(movement, i) {
    this.router.navigate(['/movement-mgm/movement', movement.id]);
    // const dialogRef = this.matDialog.open(MovementManagementFormComponent, {
    //   width: '90%',
    //   height: '90vh',
    //   autoFocus: true,
    //   disableClose: false,
    //   data: {editMode: true, movement}
    // });
    // dialogRef.afterClosed().subscribe((response: any) => {
    //   this.pageChange(this.request.page);
    // });
  }

}
