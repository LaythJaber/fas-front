import {Component, Inject, OnInit} from '@angular/core';
import {ProductStock} from '../../../../../shared/models/product-stock';
import {Inventory} from '../../../../../shared/models/Inventory';
import {Subject} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {ProductMgmService} from '../../../../../shared/services/product-mgm.service';
import {BreadcrumbService} from '../../../../../core/services/breadcrumb.service';
import {SweetAlertService} from '../../../../../shared/services/sweet-alert.service';
import {MovementMgmService} from '../../../../../shared/services/movement-mgm.service';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {CategoryService} from '../../../../../shared/services/category.service';
import {BrandService} from '../../../../../shared/services/brand.service';
import {ManufacturerService} from '../../../../../shared/services/manufacturer.service';
import {LocalStorageService} from 'ngx-webstorage';
import {Category} from '../../../../../shared/models/category';
import {Brand} from '../../../../../shared/models/brand';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-inventory-management-form',
  templateUrl: './inventory-management-form.component.html',
  styleUrls: ['./inventory-management-form.component.scss']
})
export class InventoryManagementFormComponent implements OnInit {
  inventory: Inventory;
  appRef;
  dialogComponentRef;
  onClose = new Subject();
  editMode;
  editClicked = false;
  submitted = false;
  rows: ProductStock[] = [];
  unsubscribe$ = new Subject();

  columns = [
    'PRODUCT_FORM.CODE',
    'PRODUCT_FORM.DESCRIPTION',
    'PRODUCT_FORM.MIN_STOCK',
    'PRODUCT_FORM.STOCK',
    'Dispo',
    'PRODUCT_FORM.NEW_STOCK',
    'PRODUCT_FORM.MEASURE_UNIT',
  ];
  public page = 1;
  public totalRecords: number;
  public pageSize = 10;
  loading = true;
  firstCall = true;

  productsStock: ProductStock[] = [];
  searchFormControl = new FormControl(null);
  note = '';
  disableSave = false;
  inventoryForm: FormGroup;
  productFilterForm: FormGroup;

  categories: Category[] = [];
  catPage = 1;

  subCategories: Category[] = [];
  subCatPage = 1;

  subSubCategories: Category[] = [];
  subSubCatPage = 1;

  brandList: Brand[] = [];
  brandPage = 1;
  categoryId = null;
  subCategoryId = null;
  sort: { attribute: string; direction: string };
  manufacturersList: any[] = [];
  manufacturersPage = 1;
  types: any[] = [];
  inSales: any[] = [];
  stockZero: any[] = [];
  priceZero: any[] = [];
  inPromo: any[] = [];
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];

  unsubscribe = new Subject();
  filterDialog: any;
  items = ['Filtri'];
  showFilters = false;

  constructor(private translate: TranslateService,
              public snackBar: MatSnackBar,
              private productService: ProductMgmService,
              private breadcrumbService: BreadcrumbService,
              private sweetAlertService: SweetAlertService,
              private movementService: MovementMgmService,
              private categoryService: CategoryService,
              private brandService: BrandService,
              private manufacturerService: ManufacturerService,
              private localStorageService: LocalStorageService,
              private matDialog: MatDialog,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router
  ) {
    this.initForm();
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editMode = true;
        this.getInventory(params.id);
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.initProductFilterForm();
    this.translateTypes();
    this.translateInSAles();
    this.translateInPromo();
    this.translatePriceZero();
    this.translateStockZero();
    if (!this.editMode) {
      this.movementService.getNextInventoryNumber().subscribe(d => {
        this.inventoryForm.get('number').setValue(('0000' + d).slice(-4), {emitEvent: false});
      });
    }
    this.getLazyProduct({page: this.page, pageSize: this.pageSize});
    this.getCategories();
    this.getManufacturers();
    this.getBrands();
  }

  private initForm() {
    this.inventoryForm = new FormGroup({
      id: new FormControl(),
      date: new FormControl(new Date()),
      number: new FormControl(null),
      note: new FormControl(null),
      draft: new FormControl(false),
      products: new FormControl([])
    });

  }


  save(draft: boolean) {
    if (!this.productsStock.length) {
      this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_MUST_ADD_PRODUCT'));
      return;
    }
    this.inventoryForm.get('draft').setValue(draft);
    this.inventoryForm.get('products').setValue(this.productsStock);
    this.disableSave = true;
    if (!this.editMode) {
      this.movementService.createInventory(this.inventoryForm.getRawValue()).subscribe(r => {
        this.sweetAlertService.success(this.translate.instant('DIALOG.ADD_SUCCESS'));
        this.router.navigate(['/inventory-mgm']);
      }, error => this.disableSave = false);
    } else {
      this.movementService.updateInventory(this.inventoryForm.getRawValue()).subscribe(r => {
        this.sweetAlertService.success(this.translate.instant('DIALOG.UPDATE_SUCCESS'));
        this.router.navigate(['/inventory-mgm']);
      }, error => this.disableSave = false);
    }
  }

  destroyForm() {
  }

  changeStock(product: ProductStock) {
    const index = this.productsStock.findIndex(u => u.productId === product.productId);
    if (index !== -1) {
      this.productsStock[index].newStock = product.newStock;
      if (product.newStock === product.stock || product.newStock === null) {
        this.productsStock.splice(index, 1);
      }
      return;
    }
    if (product.newStock === product.stock || product.newStock === null) {
      return;
    }
    this.productsStock = [...this.productsStock, product];
  }

  getLazyProduct(rq?) {
    const request = {
      ...this.productFilterForm.getRawValue(),
      page: this.page, pageSize: this.pageSize
    };
    this.loading = true;
    return this.movementService.getLazyProductStockList(request).subscribe(data => {
      this.rows = data.data;
      this.loading = false;
      this.firstCall = false;
      this.totalRecords = data.totalRecords;
      if (this.productsStock.length) {
        this.rows.forEach(p => {
          const index = this.productsStock.findIndex(u => u.productId === p.productId);
          if (index !== -1) {
            p.newStock = this.productsStock[index].newStock;
            p.stock = this.productsStock[index].stock;
            if (this.editMode) {
              p.movementType = this.productsStock[index].movementType;
            }
          }
        });
      }
    });
  }

  pageChange(page) {
    this.page = page;
    this.getLazyProduct({page, pageSize: this.pageSize});
  }

  activateEdit() {

  }

  showFilter(contentFilter) {
    this.initProductFilterForm();
    this.filterDialog = this.matDialog.open(contentFilter, {
      width: '65%',
      autoFocus: true,
      disableClose: false,
    });
    this.filterDialog.afterClosed().subscribe((response: any) => {
      if (response) {
        this.filterProducts();
      }
    });
  }

  filterProducts() {
    this.page = 1;
    this.getLazyProduct();

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
      parentId: this.categoryId,
      createdAt: '',
      updatedAt: '',
      status: -1
    }).subscribe(d => {
      this.subCategories = [...this.subCategories, ...d.data];
      this.subCatPage++;
    });
  }

  getSubSubCategories() {
    this.categoryService.getLazyCategoryList({
      page: this.subSubCatPage,
      pageSize: 10,
      parentId: this.subCategoryId,
      createdAt: '',
      updatedAt: '',
      status: -1
    }).subscribe(d => {
      this.subSubCategories = [...this.subSubCategories, ...d.data];
      this.subSubCatPage++;
    });
  }


  getBrands() {
    this.brandService.getLazyBrands({page: this.brandPage, pageSize: 10}).subscribe(d => {
      this.brandList = [...this.brandList, ...d.data];
      this.brandPage++;
    });
  }

  getManufacturers() {
    this.manufacturerService.getLazyManufacturers({page: this.manufacturersPage, pageSize: 10}).subscribe(d => {
      this.manufacturersList = [...this.manufacturersList, ...d.data];
      this.manufacturersPage++;
    });
  }

  translateTypes() {
    this.types = [
      {description: this.translate.instant('Attivati'), value: false},
      {description: this.translate.instant('Disattivati'), value: true},
    ];
  }

  translateInSAles() {
    this.inSales = [
      {description: this.translate.instant('Si'), value: true},
      {description: this.translate.instant('No'), value: false},
    ];
  }

  translatePriceZero() {
    this.priceZero = [
      {description: this.translate.instant('MOVEMENT_FORM.PRICE_NOT_ZERO'), value: false},
      {description: this.translate.instant('MOVEMENT_FORM.PRICE_ZERO'), value: true},
    ];
  }

  translateStockZero() {
    this.stockZero = [
      {description: this.translate.instant('MOVEMENT_FORM.STOCK_NOT_ZERO'), value: false},
      {description: this.translate.instant('MOVEMENT_FORM.STOCK_ZERO'), value: true},
    ];
  }

  translateInPromo() {
    this.inPromo = [
      {description: this.translate.instant('Nessuna promo'), value: false},
      {description: this.translate.instant('in promo'), value: true},
    ];
  }


  initProductFilterForm() {
    this.productFilterForm = new FormGroup({
      textSearch: new FormControl(),
      date: new FormControl(new Date()),
      categoryId: new FormControl(null),
      subCategoryId: new FormControl(null),
      subSubCategoryId: new FormControl(null),
      disabled: new FormControl(null),
      inSalesCheck: new FormControl(null),
      brandId: new FormControl(null),
      manufacturerId: new FormControl(null),
      priceZeroCheck: new FormControl(null),
      stockZeroCheck: new FormControl(null),
      inPromoCheck: new FormControl(null),
    });

    this.productFilterForm.get('categoryId').valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(
      (id) => {
        this.subCategories = [];
        this.subCatPage = 1;
        if (id) {
          this.categoryId = id;
          this.getSubCategories();
          return;
        }
        this.categoryId = null;
        this.productFilterForm.get('subCategory').setValue(null, {emitEvent: false});
        this.productFilterForm.get('subSubCategory').setValue(null, {emitEvent: false});
      });

    this.productFilterForm.get('subCategoryId').valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(
      (id) => {
        this.subSubCategories = [];
        this.subSubCatPage = 1;
        if (id) {
          this.subCategoryId = id;
          this.getSubSubCategories();
          return;
        }
        this.subCategoryId = null;
        this.productFilterForm.get('subSubCategory').setValue(null, {emitEvent: false});
      });
    this.filterProducts();
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.pageSize);
    this.pageChange(1);
  }

  private getInventory(id) {
    this.movementService.findInventoryById(id).subscribe(r => {
      this.inventory = r;
      this.productsStock = this.inventory.products;
      this.inventoryForm.patchValue(this.inventory, {emitEvent: false});
      this.inventoryForm.get('number').setValue(('0000' + this.inventory.number).slice(-4));
      if (!this.inventory.draft) {
        this.inventoryForm.disable();
      }
    });
  }
}
