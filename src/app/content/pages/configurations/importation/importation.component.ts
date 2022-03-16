import {Component, OnInit} from '@angular/core';
import {ImportationService} from '../../../../shared/services/importation.service';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {ImportHistory} from '../../../../shared/models/import-history';
import {TranslateService} from '@ngx-translate/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ImportType} from '../../../../shared/enum/import-type';
import {LocalStorageService} from 'ngx-webstorage';
import {Enterprise} from '../../../../shared/models/enterprise';
import {MatDialog} from '@angular/material';
import {ImportEnterpriseModel} from '../../../../shared/enum/import-enterprise-model';

@Component({
  selector: 'app-importation',
  templateUrl: './importation.component.html',
  styleUrls: ['./importation.component.scss']
})
export class ImportationComponent implements OnInit {
  public page = 1;
  public totalRecords: number;
  public pageSize;
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  loading = true;
  rows: ImportHistory[] = [];
  columns = ['ID', 'IMPORT_FORM.IMPORT_TYPE', 'IMPORT_FORM.START_AT', 'IMPORT_FORM.END_AT', 'IMPORT_FORM.TOTAL_IMPORT',
    'IMPORT_FORM.COMPLETED', 'error', 'IMPORT_FORM.AUTO_RUN', 'Url', 'IMPORT_FORM.VERSION'];
  searchFormControl: FormGroup;
  types = [];
  modalRef: any;
  productCode = '';
  dialogRef: any;
  model: ImportEnterpriseModel;

  constructor(private importService: ImportationService, private breadcrumbService: BreadcrumbService,
              private localStorageService: LocalStorageService, private matDialog: MatDialog,
              private translate: TranslateService, private sweetAlertService: SweetAlertService) {
  }

  ngOnInit() {
    this.pageSize = this.localStorageService.retrieve('pageSize') ? this.localStorageService.retrieve('pageSize') : 10;
    this.importService.getImportModel().subscribe(r => this.model = r);
    this.translateTypes();
    this.resetSearchForm();
    this.sendBreadCrumb();
    // this.importService.filter(9).subscribe(r => console.log(r));
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }

  translateTypes() {
    this.types = [
      {description: this.translate.instant('IMPORT_FORM.' + ImportType.BRAND), id: ImportType.BRAND},
      {description: this.translate.instant('IMPORT_FORM.' + ImportType.CAT), id: ImportType.CAT},
      {description: this.translate.instant('IMPORT_FORM.' + ImportType.DEPT), id: ImportType.DEPT},
      {description: this.translate.instant('IMPORT_FORM.' + ImportType.PRODUCT), id: ImportType.PRODUCT},
      {description: this.translate.instant('IMPORT_FORM.' + ImportType.TAX), id: ImportType.TAX},
    ];
  }

  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['IMPORT', 'IMPORT']);
  }

  resetSearchForm() {
    this.searchFormControl = new FormGroup({
      date: new FormControl(null),
      type: new FormControl(null)
    });
    this.filter();
  }

  filter() {
    this.page = 1;
    this.filterImport();
  }

  filterImport() {
    let date = null;
    if (this.searchFormControl.get('date').value) {
      console.log(this.searchFormControl.get('date').value);
      date = new Date(this.searchFormControl.get('date').value);
      date.setHours(date.getHours() + 3);
    }
    this.loading = true;
    return this.importService.filter({
      page: this.page,
      pageSize: this.pageSize,
      date,
      type: this.searchFormControl.value.type
    }).subscribe(data => {
      this.rows = data.data;
      this.loading = false;
      this.totalRecords = data.totalRecords;
    });
  }


  downloadFile(type) {
    this.importService.downloadFile(type).subscribe(response => {
      console.log(response);
      const binaryData = [];
      binaryData.push(response.data);
      const url = window.URL.createObjectURL(new Blob(binaryData, {type: 'application/pdf'}));
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.setAttribute('target', 'blank');
      a.href = url;
      a.download = response.filename;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

    }, error => {
      this.sweetAlertService.danger(this.translate.instant('DIALOG.FAILED_TO_DOWNLOAD'));
      console.log(error);
    });
  }


  pageChange(page: number) {
    this.page = page;
    this.filterImport();
  }

  importProducts() {
    this.importService.runImportProduct().subscribe(r => this.filterImport());
  }


  openProductCodeContent(content) {
    this.dialogRef = this.matDialog.open(content, {
      disableClose: true,
      minWidth: '50%'
    });
  }

  importProductByCode() {
    console.log(this.productCode);
    if (this.productCode) {
      this.sweetAlertService.success(this.translate.instant('request sent'));
      this.importService.importProductByCode(this.productCode).subscribe(r => {
      });
      this.resetSearchForm();
    }
  }


  importCats() {
    this.importService.runImportCat().subscribe(r => {
      this.sweetAlertService.success(this.translate.instant('DIALOG.IMPORT_RUNT'));
      this.filterImport();
    });
  }

  importDepts() {
    this.importService.runImportDept().subscribe(r => {
      this.sweetAlertService.success(this.translate.instant('DIALOG.IMPORT_RUNT'));
      this.filterImport();
    });
  }

  importBrands() {
    this.importService.runImportBrands().subscribe(r => {
      this.sweetAlertService.success(this.translate.instant('DIALOG.IMPORT_RUNT'));
      this.filterImport();
    });
  }


  importColors() {
    this.importService.runImportColors().subscribe(r => {
      this.sweetAlertService.success(this.translate.instant('DIALOG.IMPORT_RUNT'));
      this.filterImport();
    });
  }

  importSizes() {
    this.importService.runImportSizes().subscribe(r => {
      this.sweetAlertService.success(this.translate.instant('DIALOG.IMPORT_RUNT'));
      this.filterImport();
    });
  }

  importStores() {
    this.importService.runImportStore().subscribe(r => {
      this.sweetAlertService.success(this.translate.instant('DIALOG.IMPORT_RUNT'));
      this.filterImport();
    });
  }

  importProducers() {
    this.importService.runImportProducers().subscribe(r => {
      this.sweetAlertService.success(this.translate.instant('DIALOG.IMPORT_RUNT'));
      this.filterImport();
    });
  }

  importPriceList() {
    this.importService.runImportPriceList().subscribe(r => {
      this.sweetAlertService.success(this.translate.instant('DIALOG.IMPORT_RUNT'));
      this.filterImport();
    });
  }

  importAll() {
    this.importService.runImportAll().subscribe(r => {
      this.sweetAlertService.success(this.translate.instant('DIALOG.IMPORT_RUNT'));
      this.filterImport();
    });
  }

  importTax() {
    this.importService.runImportTax().subscribe(r => {
      this.sweetAlertService.success(this.translate.instant('DIALOG.IMPORT_RUNT'));
      this.filterImport();
    });
  }

}
