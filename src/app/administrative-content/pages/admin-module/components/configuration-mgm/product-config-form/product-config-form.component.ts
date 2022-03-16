import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SmsConfigurationService} from '../../../../../../shared/services/sms-configuration.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {catchError, debounceTime} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {PriceVariation} from '../../../../../../shared/enum/price-variation';
import {ProductCustomFields} from '../../../../../../shared/models/product-config';
import {FieldType} from '../../../../../../shared/enum/field-type';
import {ProductLazyRequest, ProductMgmService} from '../../../../../../shared/services/product-mgm.service';
import {Brand} from '../../../../../../shared/models/brand';
import {Category} from '../../../../../../shared/models/category';
import {SearchResponse} from '../../../../../../shared/dto/search-response';
import {Product} from '../../../../../../shared/models/product';
import {BrandService} from '../../../../../../shared/services/brand.service';
import {CategoryService} from '../../../../../../shared/services/category.service';
import {ManufacturerService} from '../../../../../../shared/services/manufacturer.service';

@Component({
  selector: 'app-product-config-form',
  templateUrl: './product-config-form.component.html',
  styleUrls: ['./product-config-form.component.scss']
})
export class ProductConfigFormComponent implements OnInit {
  productConfigForm: FormGroup;
  types = [];
  fieldTypes = [];
  columns = ['field', 'type', 'status'];
  specificColumns = ['field', 'type', 'products', 'status'];
  sharedFields: ProductCustomFields[] = [];
  specificFields: ProductCustomFields[] = [];
  loading = true;
  dialogRef: any;
  typeField: FieldType;
  descField: any;
  isSharedField: boolean;
  selectedProducts: number[];


  filterForm: FormGroup;
  brandList: Brand[] = [];
  brandSearchFormControl = new FormControl(null);
  brandPage = 1;
  showFilter = false;

  categories: Category[] = [];
  catPage = 1;
  subCategories: Category[] = [];
  subCatPage = 1;
  subSubCategories: Category[] = [];
  subSubCatPage = 1;
  manufacturersList: any[] = [];
  manufacturersPage = 1;

  allProductSelected = false;
  productToAddList: boolean[] = [];
  productSelectedToAddInLoading = false;
  productFilteredToAddInLoading = false;
  data: any;
  request: ProductLazyRequest;
  responseProduct: SearchResponse<Product>;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private smsConfigurationService: SmsConfigurationService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog, private productService: ProductMgmService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private manufacturerService: ManufacturerService,
  ) {
  }

  ngOnInit() {
    this.resetFilter();
    this.translateTypes();
    this.translateFieldTypes();
    this.productConfigForm = this.fb.group({
      manageStockBySp: [false, Validators.required],
      priceVariation: [null, Validators.required],
      id: [null],
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
        this.loading = false;
        if (res) {
          this.productConfigForm.patchValue(res);
        }
      });
  }

  translateTypes() {
    this.types = [
      {description: this.translate.instant('PRODUCT_FORM.' + PriceVariation.WITHOUT), id: PriceVariation.WITHOUT},
      {
        description: this.translate.instant('PRODUCT_FORM.' + PriceVariation.PRODUCT_VAR),
        id: PriceVariation.PRODUCT_VAR
      }
    ];
  }

  translateFieldTypes() {
    this.fieldTypes = [
      {description: this.translate.instant('PRODUCT_FORM.' + FieldType.STRING), id: FieldType.STRING},
      {
        description: this.translate.instant('PRODUCT_FORM.' + FieldType.DOUBLE),
        id: FieldType.DOUBLE
      },
      {
        description: this.translate.instant('PRODUCT_FORM.' + FieldType.BOOLEAN),
        id: FieldType.BOOLEAN
      },
      {
        description: this.translate.instant('PRODUCT_FORM.' + FieldType.COLOR),
        id: FieldType.COLOR
      },
      {
        description: this.translate.instant('PRODUCT_FORM.' + FieldType.SIZE),
        id: FieldType.SIZE
      }
    ];
  }

  saveSmsConfig() {
    console.log(this.productConfigForm.value);
    if (this.productConfigForm.invalid) {
      return;
    }
    this.smsConfigurationService.updateConfig(this.productConfigForm.value)
      .subscribe(res => {
        this.matSnackBar.open('Config updated successfully ⚡', 'Ok', {duration: 1500});
      });
  }

  toggleActivation(g: any, $event: MouseEvent) {
    g.inactive = !g.inactive;
  }

  openFormDialog(fieldContent, isSharedField) {
    this.isSharedField = isSharedField;
    this.descField = null;
    this.typeField = null;
    this.dialogRef = this.matDialog.open(fieldContent, {
      autoFocus: false,
      maxHeight: '80vh',
      minWidth: '800px'
    });
    this.dialogRef.afterClosed().subscribe(r => {
      if (r) {
        const customField = new ProductCustomFields();
        customField.type = this.typeField;
        customField.description = this.descField;
        if (this.isSharedField) {
          customField.sharedField = true;
          this.sharedFields = [customField, ...this.sharedFields];
        } else {
          customField.productsId = this.selectedProducts;
          this.specificFields = [customField, ...this.specificFields];
        }


      }
    });
  }

  removeField(field, sharedField) {
    if (sharedField) {
      const index = this.sharedFields.indexOf(field);
      if (index !== -1) {
        this.sharedFields.splice(index, 1);
      }
      return;
    }
    const indexSpec = this.specificFields.indexOf(field);
    if (indexSpec !== -1) {
      this.specificFields.splice(indexSpec, 1);
    }
  }


  selectPageProducts($event) {
    for (let i = 0; i < this.productToAddList.length; i++) {
      this.productToAddList[i] = $event.checked;
    }
  }


  pageChange($event) {
    this.request.page = $event;
    this.getLazyProduct();
  }

  getLazyProduct() {
    this.loading = true;
    return this.productService.getLazyProductList(this.request).subscribe(
      (data) => {
        this.responseProduct = data;
        this.productToAddList = new Array(this.responseProduct.data.length);
        this.allProductSelected = false;
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }


  getBrands() {
    this.brandService.getLazyBrands({page: this.brandPage, pageSize: 10}).subscribe(d => {
      this.brandList = [...this.brandList, ...d.data];
      this.brandPage++;
    });
  }

  getCategories() {
    this.categoryService.getLazyCategoryList({
      page: this.catPage,
      pageSize: 10,
      parentId: -1,
      createdAt: '',
      updatedAt: '',
      status: 1
    }).subscribe(d => {
      this.categories = [...this.categories, ...d.data];
      this.catPage++;
    });
  }

  getSubCategories() {
    this.categoryService.getLazyCategoryList({
      page: this.subCatPage,
      pageSize: 10,
      parentId: this.filterForm.get('cat1').value,
      createdAt: '',
      updatedAt: '',
      status: 1
    }).subscribe(d => {
      this.subCategories = [...this.subCategories, ...d.data];
      this.subCatPage++;
    });
  }

  getSubSubCategories() {
    this.categoryService.getLazyCategoryList({
      page: this.subSubCatPage,
      pageSize: 10,
      parentId: this.filterForm.get('cat2').value,
      createdAt: '',
      updatedAt: '',
      status: 1
    }).subscribe(d => {
      this.subSubCategories = [...this.subSubCategories, ...d.data];
      this.subSubCatPage++;
    });
  }

  getManufacturers() {
    this.manufacturerService.getLazyManufacturers({page: this.manufacturersPage, pageSize: 10}).subscribe(d => {
      this.manufacturersList = [...this.manufacturersList, ...d.data];
      this.manufacturersPage++;
    });
  }

  showHideFilter() {
    this.showFilter = !this.showFilter;
  }

  resetFilter() {
    this.initFilterForm();
    this.initRequest();
    this.getLazyProduct();
  }

  initRequest() {
    this.request = new ProductLazyRequest();
    this.request.page = 1;
    this.request.pageSize = 10;
  }

  initFilterForm() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      brandId: new FormControl(null),
      manufacturer: new FormControl(null),
      inPromo: new FormControl(false),
      inEvidenza: new FormControl(false),
      disabled: new FormControl(false),
      cat1: new FormControl(null),
      cat2: new FormControl(null),
      cat3: new FormControl(null),
      stockZero: new FormControl(false),
      priceZero: new FormControl(false),
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.textSearch = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('cat1').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.categoryId = v;
        this.request.page = 1;
        this.getLazyProduct();
        if (v) {
          this.getSubCategories();
        } else {
          this.subCategories = [];
        }
        this.filterForm.get('cat2').setValue(null);
      });

    this.filterForm.get('cat2').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        if (v) {
          this.request.categoryId = v;
          this.getSubSubCategories();
          this.request.page = 1;
          this.getLazyProduct();
        } else {
          this.subSubCategories = [];
        }
        this.filterForm.get('cat3').setValue(null);
      });

    this.filterForm.get('cat3').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        if (v) {
          this.request.categoryId = v;
          this.request.page = 1;
          this.getLazyProduct();
        }
      });

    this.filterForm.get('brandId').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.brandId = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('manufacturer').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.manufacturerId = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('inPromo').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.inPromo = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('inEvidenza').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.inEvidenza = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('disabled').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.disabled = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('priceZero').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.priceZero = v;
        this.request.page = 1;
        this.getLazyProduct();
      });

    this.filterForm.get('stockZero').valueChanges.pipe(debounceTime(500)).subscribe(
      (v) => {
        this.request.page = 1;
        this.request.stockZero = v;
        this.getLazyProduct();
      });
  }

}
