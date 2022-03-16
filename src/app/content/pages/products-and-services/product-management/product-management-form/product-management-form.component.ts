import {ManufacturerFormModalComponent} from '../../../configurations/manufacturer/manufacturer-form-modal.component';
import {ManufacturerService} from 'src/app/shared/services/manufacturer.service';
import {GenericTranslationComponent} from '../../../generic-translation/generic-translation.component';
import {BrandService} from 'src/app/shared/services/brand.service';
import {ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, FormArray} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Subject, Subscription} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {BreadcrumbService} from 'src/app/core/services/breadcrumb.service';
import {CropImageComponent} from 'src/app/shared/compoenent/crop-image/crop-image.component';
import {CustomSnackBarComponent} from 'src/app/shared/compoenent/custom-snack-bar/custom-snack-bar.component';
import {ProductBarcodeType} from 'src/app/shared/enum/product-barcode-type';
import {ProductCodeType} from 'src/app/shared/enum/product-code.enum-type';
import {IvaCode} from 'src/app/shared/models/iva-code';
import {PriceList} from 'src/app/shared/models/price-list';
import {Product, ProductType} from 'src/app/shared/models/product';
import {ProductCode} from 'src/app/shared/models/product-code';
import {ProductUm} from 'src/app/shared/models/product-um';
import {Provider} from 'src/app/shared/models/provider';
import {Stock} from 'src/app/shared/models/stock';
import {Um} from 'src/app/shared/models/um';
import {BarCodeMgmService} from 'src/app/shared/services/bar-code-mgm.service';
import {ConfigurationsService} from 'src/app/shared/services/configurations.service';
import {MessageService} from 'src/app/shared/services/message.service';
import {MovementMgmService} from 'src/app/shared/services/movement-mgm.service';
import {ProductMgmService} from 'src/app/shared/services/product-mgm.service';
import {ProviderMgmService} from 'src/app/shared/services/provider-mgm.service';
import {SweetAlertService} from 'src/app/shared/services/sweet-alert.service';
import {UmService} from 'src/app/shared/services/Um.service';
import {CodiceIvaFormModalComponent} from '../../../configurations/codice-iva/codice-iva-form-modal.component';
import {LineaFormModalComponent} from '../../../configurations/linea/linea-form-modal.component';
import {RepartoFormModalComponent} from '../../../configurations/reparto/reparto-form-modal.component';
import {UmModalComponent} from '../../../configurations/um/um-modal.component';
import {PriceListFormComponent} from '../../price-list/price-list-form/price-list-form.component';
import {PriceListService} from '../../../../../shared/services/price-list.service';
import {ProductHistoryComponent} from '../product-history/product-history.component';
import {TagService} from 'src/app/shared/services/tag.service';
import {BrandFormModalComponent} from '../../../configurations/brand/brand-form-modal.component';
import {TagFormModalComponent} from '../../../configurations/tag/tag-form-modal.component';
import {CheckListService} from '../../../../../shared/util/check-list-service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {SelectionModel} from '@angular/cdk/collections';
import {TodoItemFlatNode} from '../../../../../shared/util/todo-item-flat-node';
import {TodoItemNode} from '../../../../../shared/util/todo-item-node';
import _ from 'lodash';
import * as moment from 'moment';
import {ProviderComponent} from '../../../configurations/provider/provider.component';
import {Pack} from '../../../../../shared/models/pack';
import {Tag} from '../../../../../shared/models/tag';
import {TranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {Language} from '../../../../../shared/models/language';
import {LanguageService} from '../../../../../shared/services/language.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ProductResources} from '../../../../../shared/models/product-resources';
import {ProductResourceService} from '../../../../../shared/services/product/product-resource.service';
import {ProductResource} from '../../../../../shared/models/product/product-resource';
import {ProductImageFormComponent} from '../product-image-form/product-image-form.component';
import {StockHistoryComponent} from '../../../stock-and-movement/stock-management/stock-history/stock-history.component';
import {StockHistory} from '../../../../../shared/models/stock-history';
import {PurchaseState} from "../../../../../shared/models/purchase/purchase-state";

@Component({
  selector: 'app-product-management-form',
  templateUrl: './product-management-form.component.html',
  styleUrls: ['./product-management-form.component.scss'],
  providers: [CheckListService]
})
export class ProductManagementFormComponent implements OnInit, OnDestroy {
  @ViewChild('stockHistoryTemplate') stockHistoryTemplate: TemplateRef<StockHistoryComponent>;

  activeTabId: string = 'tab-general-inf';
  stockHistoryRows: StockHistory[] = [];
  stockColumns = [
    'DATA_TABLE.DATE',
    'DATA_TABLE.QUANTITY',
    'PRODUCT_FORM.MEASURE_UNIT',
    // 'DATA_TABLE.PURCHASE_COST',
    'DATA_TABLE.PRICE',
    'DATA_TABLE.TOTAL',
    'DATA_TABLE.CAUSAL',
  ];


  constructor(
    private dialog: MatDialog,
    private productService: ProductMgmService,
    private configurationsService: ConfigurationsService,
    private providerService: ProviderMgmService,
    private matDialog: MatDialog,
    private movementService: MovementMgmService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private messageService: MessageService,
    private breadcrumbService: BreadcrumbService,
    public snackBar: MatSnackBar,
    private router: Router,
    private umService: UmService,
    private barCodeService: BarCodeMgmService,
    private priceListService: PriceListService,
    private brandService: BrandService,
    private tagsService: TagService,
    private fb: FormBuilder,
    private manufacturerService: ManufacturerService,
    private _database: CheckListService,
    private translationLoader: TranslationLoaderService,
    private languageService: LanguageService,
    private sanitizer: DomSanitizer,
    private productResourceService: ProductResourceService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    this.sendBreadCrumb();
    this.initProductForm();
    this.getProductTypesList();
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editMode = true;
        this.getProductDetails(params.id);
        this.getProductResources(params.id);
        const queryParams = this.route.snapshot.queryParams;
        if (queryParams.tab) {
          this.activeTabId = 'tab-images';
        }
      }
      else {
        this.editMode = false;
        this.product = null;
        this.initialize();
      }
    });
  }

  /**** nodes ***************************/

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  /****************************************/


  // @ViewChild('stockHistoryTemplate') stockHistoryTemplate: TemplateRef<StockHistoryComponent>;
  onClose = new Subject();
  appRef;
  dialogComponentRef;
  editMode = false;
  editClicked = false;
  productForm: FormGroup;
  packForm: FormGroup;
  submitted = false;
  product: Product;
  dRef: any;
  productPicture: string;

  IvaCodeList: IvaCode[] = [];
  IvaCodePage = 1;

  providersList: any[] = [];
  providersPage = 1;

  lineaList: any[] = [];
  lineaPage = 1;

  brandList: any[] = [];
  brandPage = 1;

  repartoList: any[] = [];
  repartoPage = 1;

  tags: Tag[] = [];
  tagsPage = 1;

  manufacturersList: any[] = [];
  manufacturersPage = 1;

  packs: Pack[] = [];
  dialogRefPack: any;
  rechargeFormControl = new FormControl();
  priceFormControl = new FormControl(0);
  rechargePDVFormControl = new FormControl();
  pricePDVFormControl = new FormControl();
  purchasePriceFormControl = new FormControl(null);
  activeDetailSaleFormControl = new FormControl(true);
  unsubscribe$ = new Subject();
  getBrandLoading = false;
  loading = false;
  preventValueChange = false;
  productDetails: Stock = new Stock();
  dialogRef: any;
  productDetailsForm: FormGroup;
  productUmForm: FormGroup;
  productCodeForm: FormGroup;
  disableSave = false;
  ticketNumber = 1;
  printTicketSent = false;
  types = [];
  productCodeTypes = [];
  selectedType;
  printMode;
  messages: any[] = [];
  subscription: Subscription;
  private formBuilder = new FormBuilder();
  umPage = 1;
  um: Um[] = [];
  ums: Um[] = [];
  listPrice: PriceList[] = [];

  searchValue: string;
  rows: ProductUm[] = [];
  altProdCodes: ProductCode[] = [];
  validBarcode = true;
  uniqueBarcode = true;

  descriptionByLang = new FormControl();
  commercialDescriptionByLang = new FormControl();


  columns = ['PRODUCT_FORM.CODE',
    'PRODUCT_FORM.DESCRIPTION',
    'PRODUCT_FORM.PriceListValue1',
    'PRODUCT_FORM.PriceList1FormulaField',
    'PRODUCT_FORM.PriceListValue2',
    'PRODUCT_FORM.PriceList2FormulaField',
    'PRODUCT_FORM.PriceListValue3',
    'PRODUCT_FORM.PriceList3FormulaField',
    'PRODUCT_FORM.PriceListValue4',
    'PRODUCT_FORM.PriceList4FormulaField'];


  columnsColor = [];
  searchFilter: Subject<string> = new Subject<string>();
  colors: any[];
  sizes: any[];

  config = {
    language: 'it'
  };

  selectedTab = 0;
  languageList: Language[] = [];
  showSizeColor = false;
  generatedImage: string;
  resources: ProductResources[];
  localResources: ProductResource[] = [];
  sellPointResources: ProductResource[] = [];


  /********* nodes functions ************/

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  // tslint:disable-next-line:no-shadowed-variable
  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  // tslint:disable-next-line:no-shadowed-variable
  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.id = node.id;
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }


  ngOnInit() {
  }

  initialize() {
    this.translateProductCodeTypes();
    this.getLanguageList();

    this.descriptionByLang.disable();
    this.commercialDescriptionByLang.disable();
    this.commercialDescriptionByLang.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      if (c) {
        this.productForm.get('metaTitle').setValue(c);
      }
    });

    this.productUmForm = this.formBuilder.group({
      id: new FormControl(),
      productId: new FormControl(null),
      umId: new FormControl(null, Validators.required),
      um: new FormControl(null),
      multiply: new FormControl(null, Validators.required),
      description: new FormControl(),
      index: new FormControl(null)
    });

    this.packForm = this.formBuilder.group({
      id: new FormControl(), // productCode
      productId: new FormControl(null),
      price: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
    });

    this.productCodeForm = this.formBuilder.group({
      id: new FormControl(), // productCode
      productId: new FormControl(null),
      code: new FormControl(null, Validators.required),
      codeType: new FormControl(null, Validators.required),
      qta: new FormControl(null),
      supplierCode: new FormControl(null),
      customerCode: new FormControl(null),
      defaultCode: new FormControl(true),
      index: new FormControl(null),
    });

    this.productCodeForm.get('codeType').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      this.validBarcode = true;
      this.uniqueBarcode = true;
      if (c === 'CUSTOMER') {
        this.productCodeForm.get('customerCode').setValidators(Validators.required);
        this.productCodeForm.get('customerCode').updateValueAndValidity();
        this.productCodeForm.get('supplierCode').setValidators(null);
        this.productCodeForm.get('supplierCode').setValue(null);
        this.productCodeForm.get('supplierCode').updateValueAndValidity();
      }
      if (c === 'SUPPLIER') {
        this.productCodeForm.get('supplierCode').setValidators(Validators.required);
        this.productCodeForm.get('supplierCode').updateValueAndValidity();
        this.productCodeForm.get('customerCode').setValidators(null);
        this.productCodeForm.get('customerCode').setValue(null);
        this.productCodeForm.get('customerCode').updateValueAndValidity();
      }
      if (c !== 'SUPPLIER' && c !== 'CUSTOMER') {
        this.productCodeForm.get('customerCode').setValidators(null);
        this.productCodeForm.get('customerCode').setValue(null);
        this.productCodeForm.get('customerCode').updateValueAndValidity();
        this.productCodeForm.get('supplierCode').setValidators(null);
        this.productCodeForm.get('supplierCode').setValue(null);
        this.productCodeForm.get('supplierCode').updateValueAndValidity();
      }
      if (c === ProductCodeType.BARCODEEAN13 || c === ProductCodeType.BARCODEEAN8) {
        this.checkValidEan();
      }
    });

    this.productCodeForm.get('code').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(e => {
      this.checkValidEan();
    });

    this.initCategoryTree();


    if (this.product != null) {
      this.rows = this.product.productUms;
      if (this.rows) {
        this.rows.forEach((value, index) => {
          value.index = index;
          value.umId = value.um.id;
        });
      }
      this.altProdCodes = this.product.productCodes;
      this.altProdCodes.forEach((value, index) => {
        value.index = index;
      });
    }


    this.umService.getAll().subscribe(r => {
      this.ums = r;
      this.um = this.ums;
    });

    this.productDetailsForm = new FormGroup({
      stock: new FormControl(),
      mediumCost: new FormControl(),
      lastCost: new FormControl(),
      lastPrice: new FormControl(),
    });
    this.productDetailsForm.disable();

    this.productForm.get('createdAt').disable();
    this.productForm.get('meduimCost').disable();
    this.productForm.get('lastLoadingCost').disable();
    this.productForm.get('lastSalePrice').disable();
    this.productForm.get('stock').disable();
    this.rechargePDVFormControl.disable();
    this.getConfiguration();
    this.getBrand();

    this.activeDetailSaleFormControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      this.productForm.get('enabled').setValue(c);
    });

    this.purchasePriceFormControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      this.productForm.get('purchasePrice').setValue(c);
      if (this.productForm.get('price').value !== 0) {
        this.rechargeFormControl.setValue(((this.productForm.get('price').value - this.productForm.get('purchasePrice').value) * 100)
          / this.productForm.get('purchasePrice').value, {
          onlySelf: true,
          emitEvent: false,
        });
      }
    });

    this.rechargeFormControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      this.productForm.get('recharge').setValue(c);
      if (c === 0) {
        this.priceFormControl.setValue(this.productForm.get('purchasePrice').value, {
          onlySelf: true,
          emitEvent: false,
        });
        this.productForm.get('price').setValue(this.priceFormControl.value);
        return;
      }

      if (this.productForm.get('purchasePrice').value !== 0 && this.productForm.get('price').value === 0) {
        this.priceFormControl.setValue(this.productForm.get('purchasePrice').value + (this.productForm.get('purchasePrice').value *
          this.productForm.get('recharge').value / 100), {
          onlySelf: true,
          emitEvent: false,
        });
        this.productForm.get('price').setValue(this.priceFormControl.value);
        return;
      }

      if (this.productForm.get('price').value !== 0 && this.productForm.get('purchasePrice').value === 0) {
        this.purchasePriceFormControl.setValue(this.productForm.get('price').value /
          (1 + (this.productForm.get('recharge').value / 100)), {
          onlySelf: true,
          emitEvent: false,
        });
        this.productForm.get('purchasePrice').setValue(this.purchasePriceFormControl.value);
        return;
      }


      if (this.productForm.get('price').value !== 0 && this.productForm.get('purchasePrice').value !== 0) {
        this.priceFormControl.setValue(this.productForm.get('purchasePrice').value + (this.productForm.get('purchasePrice').value *
          this.productForm.get('recharge').value / 100), {
          onlySelf: true,
          emitEvent: false,
        });
        this.productForm.get('price').setValue(this.priceFormControl.value);
        return;
      }

    });

    this.priceFormControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      this.productForm.get('price').setValue(c);
      if (this.productForm.get('purchasePrice').value !== 0) {
        this.rechargeFormControl.setValue(((this.productForm.get('price').value - this.productForm.get('purchasePrice').value) * 100)
          / this.productForm.get('purchasePrice').value, {
          onlySelf: true,
          emitEvent: false,
        });
      }
    });

    if (this.editMode) {
      if (this.product.sharedVariationList && this.product.sharedVariationList.length) {
        this.showSizeColor = true;
        this.mapColorSize();
      } else {
        this.showSizeColor = false;
      }
      /* this.movementService.getStockHistoryByProduct(this.product.id).subscribe(r => {
         this.productDetails = r;
         this.productDetails.id = this.product.id;
         //this.productDetails.description = this.product.description;
         this.productDetails.minStock = this.product.minStock;
         this.productDetails.measureUnit = this.product.measureUnit;
         this.productDetailsForm.patchValue(this.productDetails);
       });*/
      this.preventValueChange = true;
      this.productForm.patchValue(this.product);
      this.packs = [...this.productForm.get('packs').value, ...this.packs];
      // this.productPicture = this.product.image;

      if (this.product.createdAt) {
        this.productForm.get('createdAt').setValue(this.formatDate(this.product.createdAt));
      }
      if (this.product.updatedAt) {
        this.productForm.get('updatedAt').setValue(this.formatDate(this.product.updatedAt));
      }
      if (this.product.lastVisitedDate) {
        this.productForm.get('lastVisitedDate').setValue(this.formatDate(this.product.lastVisitedDate));
      }
      this.productForm.get('recharge').setValue(this.product.recharge);
      this.productForm.get('price').setValue(this.product.price);
      this.purchasePriceFormControl.patchValue(this.product.purchasePrice);
      this.rechargeFormControl.patchValue(this.product.recharge);
      this.priceFormControl.patchValue(this.product.price);
      this.activeDetailSaleFormControl.patchValue(this.product.enabled);
      this.activeDetailSaleFormControl.disable();

      if (this.product.measureUnit != null) {
        this.productForm.get('measureUnitId').setValue(this.product.measureUnit.id);
      }
      if (this.product.linea != null) {
        this.productForm.get('lineaId').setValue(this.product.linea.id);
      }
      if (this.product.provider != null) {
        this.productForm.get('providerId').setValue(this.product.provider.id);
      }
      if (this.product.manufacturer != null) {
        this.productForm.get('manufacturerId').setValue(this.product.provider.id);
      }
      if (this.product.tax != null) {
        this.productForm.get('taxId').setValue(this.product.tax.id);
        const ind = this.IvaCodeList.filter(u => u.id === this.product.tax.id).shift();
        if (!ind) {
          this.IvaCodeList = [...this.IvaCodeList, this.product.tax];
        }
      }
      if (this.product.brand != null) {
        this.productForm.get('brandId').setValue(this.product.brand.id);
        const ind = this.brandList.filter(u => u.id === this.product.brand.id).shift();
        if (!ind) {
          this.brandList = [...this.brandList, this.product.brand];
        }
      }

      this.tags = [...this.tags, ...this.product.tags];
      this.productForm.get('tagIds').setValue(this.product.tags.map(({id}) => id));

      this.productForm.disable();
      this.purchasePriceFormControl.disable();
      this.rechargeFormControl.disable();
      this.priceFormControl.disable();
      this.rechargePDVFormControl.disable();
      this.pricePDVFormControl.disable();

      this.productForm.controls.description = this.setDescription(this.product.transInfo);
      this.descriptionByLang.setValue(this.setDescriptionByLang(this.productForm.controls.description.value).description);

      this.productForm.controls.commercialDescription = this.setCommercialDescription(this.product.transInfo);
      this.commercialDescriptionByLang.setValue
      (this.setDescriptionByLang(this.productForm.controls.commercialDescription.value).description);

      this.productForm.controls.consultationNumber.patchValue(this.product.consultationNumber);
      this.productForm.controls.lastVisitedDate.patchValue(this.product.lastVisitedDate);

      this.cdr.detectChanges();
    }

  }

  initProductForm() {
    this.productForm = new FormGroup({
      id: new FormControl(),
      createdAt: new FormControl((new Date()).toLocaleDateString()),
      updatedAt: new FormControl(),
      description: new FormControl([]),
      commercialDescription: new FormControl([]),
      lineaId: new FormControl(),
      repartoId: new FormControl(),
      providerId: new FormControl(),
      manufacturerId: new FormControl(),
      measureUnitId: new FormControl(null),
      activeDetailSale: new FormControl(true),
      enabled: new FormControl(true),
      taxId: new FormControl(null),
      minStock: new FormControl(null),
      purchasePrice: new FormControl(0),
      recharge: new FormControl(0),
      price: new FormControl(0),
      meduimCost: new FormControl(),
      lastLoadingCost: new FormControl(),
      lastSalePrice: new FormControl(),
      stock: new FormControl(),
      availability: new FormControl(),
      image: new FormControl(null),
      rechargeSale: new FormControl(null),
      priceSale: new FormControl(null),
      originalDescription: new FormControl(null),
      consultationNumber: new FormControl(null),
      lastVisitedDate: new FormControl(),
      brandId: new FormControl(null),


      weighted: new FormControl(false),
      weightUm: new FormControl(null),
      weight: new FormControl(null),
      netWeight: new FormControl(null),
      weightType: new FormControl(null),
      variableWeightSalePrice: new FormControl(null),
      variableWeightPromoSalePrice: new FormControl(null),
      variableWeightPurchasePrice: new FormControl(null),
      lxwxh: new FormControl(null),

      foodPairing: new FormControl(null),
      alcoholPercentage: new FormControl(null),
      grapeVineDesignation: new FormControl(null),
      servingTemperature: new FormControl(null),
      region: new FormControl(null),
      typologia: new FormControl(null),
      productHistory: new FormControl(null),

      urlKey: new FormControl(null),
      metaTitle: new FormControl(null),
      metaKey: new FormControl(null),
      metaDescription: new FormControl(null),

      tagIds: new FormControl([]),
      categoriesId: new FormControl([]),
      variationsId: new FormControl([]),
      sharedVariationsId: new FormControl([]),

      dateStartOff: new FormControl(null), // (Date debut promo)
      dateEndOff: new FormControl(null), // (Date debut promo)
      priceOff: new FormControl(), // (prix en promo)
      scontOff: new FormControl(), // (valeur remise %)
      desOff: new FormControl(),

      images: new FormControl(),

      maxQuantityByCard: new FormControl(),
      threshold: new FormControl(),
      supplement: new FormControl(),

      /*   packingPrice: new FormControl(),
         packingQuantity: new FormControl(),
         packingPrice2: new FormControl(),
         packingQuantity2: new FormControl(),
         packingPrice3: new FormControl(),
         packingQuantity3: new FormControl(),*/

      packs: new FormControl([]),

      pricePerPrincipalMeasureUnit: new FormControl(null),
      code: new FormControl(null),
      type: new FormControl(ProductType.FOOD, Validators.required),
    });
    this.productForm.get('weighted').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      if (val === true) {
        this.productForm.controls['pricePerPrincipalMeasureUnit'].setValidators
        ([Validators.required, Validators.minLength(1), Validators.min(0)]);
        this.productForm.controls['measureUnitId'].setValidators([Validators.required, Validators.minLength(1), Validators.min(0)]);
        this.productForm.controls['weight'].setValidators([Validators.required, Validators.minLength(1), Validators.min(0)]);
        this.productForm.controls['weightUm'].setValidators([Validators.required, Validators.minLength(1), Validators.min(0)]);
        this.productForm.controls['priceSale'].clearValidators();

        this.cdr.detectChanges();

      } else {
        this.productForm.controls['pricePerPrincipalMeasureUnit'].clearValidators();
        this.productForm.controls['measureUnitId'].clearValidators();
        this.productForm.controls['weight'].clearValidators();
        this.productForm.controls['weightUm'].clearValidators();
        this.productForm.controls['priceSale'].setValidators([Validators.required, Validators.minLength(1), Validators.min(0)]);

        this.cdr.detectChanges();
      }
      this.productForm.controls['pricePerPrincipalMeasureUnit'].updateValueAndValidity();
      this.productForm.controls['measureUnitId'].updateValueAndValidity();
      this.productForm.controls['weight'].updateValueAndValidity();
      this.productForm.controls['weightUm'].updateValueAndValidity();
      this.productForm.controls['priceSale'].updateValueAndValidity();
      this.cdr.detectChanges();

    });

    this.productForm.get('dateStartOff').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(startDate => {
      if (startDate === null) {
        this.productForm.get('dateEndOff').disable();
        this.cdr.detectChanges();
        this.productForm.controls['desOff'].clearValidators();
        this.productForm.controls['priceOff'].clearValidators();
        this.productForm.controls['scontOff'].clearValidators();
      } else {


        this.cdr.detectChanges();
        this.productForm.get('dateEndOff').enable();

        this.productForm.get('dateEndOff').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(endDate => {
          if (endDate !== null) {
            this.productForm.controls['desOff'].setValidators([Validators.required, Validators.minLength(1), Validators.min(0)]);
            this.productForm.controls['priceOff'].setValidators([Validators.required, Validators.minLength(1), Validators.min(0)]);
            this.productForm.controls['scontOff'].setValidators([Validators.required, Validators.minLength(1), Validators.min(0)]);
            this.cdr.detectChanges();

          } else {
            this.cdr.detectChanges();
            this.productForm.controls['desOff'].clearValidators();
            this.productForm.controls['priceOff'].clearValidators();
            this.productForm.controls['scontOff'].clearValidators();
          }
          this.productForm.controls['desOff'].updateValueAndValidity();
          this.productForm.controls['priceOff'].updateValueAndValidity();
          this.productForm.controls['scontOff'].updateValueAndValidity();

          this.cdr.detectChanges();
        });
      }
    });
    this.productForm.controls['desOff'].updateValueAndValidity();
    this.productForm.controls['priceOff'].updateValueAndValidity();
    this.productForm.controls['scontOff'].updateValueAndValidity();

  }

  formatDate(date: Date): String {
    return new Date(date).toLocaleDateString()
      + ' ' + new Date(date).getHours() + ':' +
      new Date(date).getMinutes() + ':' +
      new Date(date).getSeconds();
  }

  sendBreadCrumb(): void {
    if (this.editMode) {
      this.breadcrumbService.sendBreadcrumb(['PRODUCT_AND_SERVICES', 'PRODUCT', 'UPDATE']);
      return;
    }
    this.breadcrumbService.sendBreadcrumb(['PRODUCT_AND_SERVICES', 'PRODUCT', 'NEW']);
  }

  getProductDetails(productId: number) {
    this.productService.getById(productId).subscribe((product) => {
      this.product = product;
      this.stockHistoryRows = product.histories;
      console.log('product details type = ', this.product.type);
      this.initialize();
    });
  }

  getLanguageList() {
    this.languageService.getLanguages().subscribe(r => {
      this.languageList = r;
      this.selectedTab = this.languageList.findIndex(u => u.code === this.translate.currentLang);
      const transInfo = this.formBuilder.array(
        this.languageList.map(l => {
          const obj = this.product ? this.product.transInfo.find(t => t.langCode === l.code) : null;
          return new FormGroup({
            id: new FormControl(obj ? obj.id : null),
            langCode: new FormControl(l.code),
            langCodeId: new FormControl(l.id),
            description: new FormControl(obj ? obj.description : null),
            commercialDescription: new FormControl(obj ? obj.commercialDescription : null),
            note: new FormControl(obj ? obj.note : null),
            allergies: new FormControl(obj ? obj.allergies : null),
            ingredients: new FormControl(obj ? obj.ingredients : null),
          });
        })
      );
      this.productForm.addControl('transInfo', transInfo);
    });
  }


  productTypeList: {id: string, label: string}[] = [];
  getProductTypesList() {
    this.productTypeList = Object.keys(ProductType).map((key) => {return {id: ProductType[key], label: ProductType[key]}});
    console.log('types = ', this.productTypeList);
  }

  getProductCategoryList() {
    const productCategoryList: number[] = [];
    for (const node of this.checklistSelection.selected) {
      const indexNode = productCategoryList.findIndex(c => c === node.id);
      if (indexNode < 0) {
        productCategoryList.push(node.id);

        let parent = this.getParentNode(node);
        while (parent !== null) {
          const index = productCategoryList.findIndex(c => c === parent.id);
          if (index < 0) {
            productCategoryList.push(parent.id);
          }
          parent = this.getParentNode(parent);
        }
      }
    }
    console.log('Product Category List = ', productCategoryList);
    return productCategoryList;
  }

  initCategoryTree() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this._database.dataChange.subscribe(data => {
      this.sortCategory(data);
      data.forEach(c => {
        if (c.children && c.children.length) {
          this.sortCategory(c.children);
        }
      });
      this.dataSource.data = data;
      if (this.product != null) {
        for (const node of this.dataSource._flattenedData.getValue()) {
          const index = this.product.categoryList.findIndex(pcat => pcat.id === node.id);
          if (index >= 0) {
            this.checklistSelection.select(node);
            this.treeControl.expandDescendants(node);
          }
        }
      }
    });
  }

  sortCategory(cats: TodoItemNode[]) {
    cats.sort((a, b) => a.item.localeCompare(b.item));
    if (this.product) {
      cats.sort((a, b) => {
        const aCat = this.product.categoryList.filter(u => u.id === a.id).shift();
        const bCat = this.product.categoryList.filter(u => u.id === b.id).shift();
        if (!aCat) {
          return 1;
        }
        if (!bCat) {
          return -1;
        }
        return this.product.categoryList.indexOf(aCat) - this.product.categoryList.indexOf(aCat);
      });
    }
  }

  filterChanged(filterText: string) {
    this._database.filter(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  closeForm() {
    this.router.navigate(['/product-mgm']).then();
  }

  activateEdit() {
    if (this.editMode) {
      this.editClicked = true;
      this.productForm.enable();
      this.purchasePriceFormControl.enable();
      this.rechargeFormControl.enable();
      this.priceFormControl.enable();
      this.rechargePDVFormControl.enable();
      this.pricePDVFormControl.enable();
      this.productForm.get('createdAt').disable();
      this.productForm.get('updatedAt').disable();
      this.productForm.get('lastVisitedDate').disable();
      this.productForm.get('meduimCost').disable();
      this.productForm.get('lastLoadingCost').disable();
      this.productForm.get('lastSalePrice').disable();
      this.productForm.get('stock').disable();
      if (this.productForm.get('dateEndOff').value === null) {
        this.productForm.get('dateEndOff').disable();
      }
      this.activeDetailSaleFormControl.enable();
      this.preventValueChange = false;
    }
  }

  save() {
    this.submitted = true;
    const p: Product = this.productForm.getRawValue();

    for (let i = 0; i < p.commercialDescription.length; i++) {
      const t: any = p.commercialDescription[i];
      const tobj = p.transInfo.find(tt => tt.langCode === t.langCode);
      if (tobj) {
        tobj.commercialDescription = t.description;
      }
    }

    for (let i = 0; i < p.description.length; i++) {
      const t: any = p.description[i];
      const tobj = p.transInfo.find(tt => tt.langCode === t.langCode);
      if (tobj) {
        tobj.description = t.description;
      }
    }

    // if (this.existsAtLeastOneDescription(this.productForm.get('transInfo').value) === 0) {
    //   this.productForm.controls['transInfo'].setErrors({'incorrect': true});
    // }
    if (!this.productForm.valid || this.priceFormControl.invalid || this.purchasePriceFormControl.invalid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then();
      return;
    }
    // if (this.productForm.get('priceSale').value < this.productForm.get('price').value) {
    //   this.sweetAlertService.notification(this.translate.instant('DIALOG.PREZZO_INF_ACQ')).then();
    //   return;
    // }

    this.disableSave = true;

    // new product
    if (!this.editMode) {
      p.productCodeRequests = this.altProdCodes;
      p.productUmRequestList = this.rows;
      p.categoriesId = this.getProductCategoryList();
      p.dateStartOff = this.productForm.value.dateStartOff ? moment(this.productForm.value.dateStartOff).format('YYYY-MM-DD') : null;
      p.dateEndOff = this.productForm.value.dateEndOff ? moment(this.productForm.value.dateEndOff).format('YYYY-MM-DD') : null;
      p.packs = this.packs;

      this.productService.addNewProduct(p).subscribe((product) => {
        this.showSnackBar({
          text: `${this.setDescriptionByLang(p.transInfo).description}`,
          actionIcon: 'save',
          actionMsg: this.translate.instant('DIALOG.ADD_SUCCESS')
        });
        console.log('added product = ', product);
        this.router.navigate(['/product-mgm/product', product.id], {
          queryParams: {
            tab: 'img'
          }
        }).then();
      }, () => {
        this.disableSave = false;
      });
    }

    // edit product
    else {
      p.productUmRequestList = this.rows;
      p.productCodeRequests = this.altProdCodes;
      p.categoriesId = this.getProductCategoryList();
      p.dateStartOff = this.productForm.value.dateStartOff ? moment(this.productForm.value.dateStartOff).format('YYYY-MM-DD') : null;
      p.dateEndOff = this.productForm.value.dateEndOff ? moment(this.productForm.value.dateEndOff).format('YYYY-MM-DD') : null;
      p.packs = this.packs;
      this.disableSave = false;

      console.log('product to save  = ', p);

      this.productService.editProduct(p).subscribe(d => {
        this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        this.product = d;
        this.sendMessageProd(true, d);
        this.disableSave = false;
      }, (error) => {
        this.disableSave = false;
        console.log('update product error = ', error);
      });
    }
  }

  openChangeImageModal() {
    if (!this.editMode || this.editClicked) {
      const dialogRef = this.dialog.open(CropImageComponent, {width: '60%'});
      dialogRef.afterClosed().subscribe(d => {
        if (d) {
          this.productPicture = d;
        }
      });
    }
  }

  showSnackBar(data: any) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      data,
      duration: 5000,
      panelClass: 'white-snackbar'
    });
  }

  getBrand() {
    this.brandService.getLazyBrands({page: this.brandPage, pageSize: 10}).subscribe(d => {
      this.brandList = [...this.brandList, ...d.data];
      this.brandPage++;
    });
  }


  getConfiguration() {

    this.configurationsService.lazyIvaCode({page: this.IvaCodePage, pageSize: 10}).subscribe(d => {
      this.IvaCodeList = [...this.IvaCodeList, ...d.data];
      this.IvaCodePage++;
    });

    this.providerService.getLazyProviderList({page: this.providersPage, pageSize: 10, visible: true}).subscribe(d => {
      this.providersList = [...this.providersList, ...d.data];
      this.providersPage++;
    });

    this.configurationsService.getLazyLineas({page: this.lineaPage, pageSize: 10}).subscribe(d => {
      this.lineaList = [...this.lineaList, ...d.data];
      this.lineaPage++;
    });


    this.configurationsService.getLazyRepartos({page: this.repartoPage, pageSize: 10}).subscribe(d => {
      this.repartoList = [...this.repartoList, ...d.data];
      this.repartoPage++;
    });

    this.manufacturerService.getLazyManufacturers({page: this.manufacturersPage, pageSize: 10}).subscribe(d => {
      this.manufacturersList = [...this.manufacturersList, ...d.data];
      this.manufacturersPage++;
    });

    this.tagsService.getLazyTags({page: this.tagsPage, pageSize: 5}).subscribe(d => {
      this.tags = [...this.tags, ...d.data];
      this.tags = _.uniqBy(this.tags, 'id');
      this.tagsPage++;
    });

  }

  getConfigurationsByType(confType: string) {
    switch (confType) {
      case 'TAX': {
        this.configurationsService.lazyIvaCode({page: this.IvaCodePage, pageSize: 10}).subscribe(d => {
          this.IvaCodeList = [...this.IvaCodeList, ...d.data];
          this.IvaCodePage++;
        });
        break;
      }
      case 'PROVIDER': {
        this.providerService.getLazyProviderList({
          page: this.providersPage,
          pageSize: 10,
          visible: true
        }).subscribe(d => {
          this.providersList = [...this.providersList, ...d.data];
          this.providersPage++;
        });
        break;
      }

      case 'LINEA': {
        this.configurationsService.getLazyLineas({page: this.lineaPage, pageSize: 10}).subscribe(d => {
          this.lineaList = [...this.lineaList, ...d.data];
          this.lineaPage++;
        });
        break;
      }

      case 'REPARTO': {
        this.configurationsService.getLazyRepartos({page: this.repartoPage, pageSize: 10}).subscribe(d => {
          this.repartoList = [...this.repartoList, ...d.data];
          this.repartoPage++;
        });
        break;
      }

      case 'MANUFACTURER': {
        this.manufacturerService.getLazyManufacturers({page: this.manufacturersPage, pageSize: 10}).subscribe(d => {
          this.manufacturersList = [...this.manufacturersList, ...d.data];
          this.manufacturersPage++;
        });
        break;
      }

      case 'TAG': {
        console.log(this.tagsPage);
        this.tagsService.getLazyTags({page: this.tagsPage, pageSize: 5}).subscribe(d => {
          console.log(d.data);

          this.tags = [...this.tags, ...d.data];
          this.tags = _.uniqBy(this.tags, 'id');
          this.tagsPage++;
        });
      }

    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  addUM() {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    const dialogRef = this.matDialog.open(UmModalComponent, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.um = [d, ...this.um];
        this.productForm.get('measureUnitId').setValue(d.id);
      }
    });
  }

  addTAX() {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    const dialogRef = this.matDialog.open(CodiceIvaFormModalComponent, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.IvaCodeList = [d, ...this.IvaCodeList];
        this.productForm.get('taxId').setValue(d.id);
      }
    });
  }

  addReparto() {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    const dialogRef = this.matDialog.open(RepartoFormModalComponent, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.repartoList = [d, ...this.repartoList];
        this.productForm.get('repartoId').setValue(d.id);
      }
    });
  }


  addManufacturer() {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    const dialogRef = this.matDialog.open(ManufacturerFormModalComponent, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.manufacturersList = [d, ...this.manufacturersList];
        this.productForm.get('manufacturerId').setValue(d.id);
      }
    });
  }

  addProvider() {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    const dialogRef = this.matDialog.open(ProviderComponent, {
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.providersList = [d, ...this.providersList];
        this.productForm.get('providerId').setValue(d.id);
      }
    });

    this.sendMessage(false, new Provider(), dialogRef);
  }

  sendMessage(mode: boolean, obj: any, dialogRef: any): void {
    this.messageService.sendMessage([mode, obj, dialogRef]);
  }

  sendMessageProd(mode: boolean, obj: any): void {
    this.messageService.sendMessage([mode, obj]);
  }

  addLinea() {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    const dialogRef = this.matDialog.open(LineaFormModalComponent, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
      data: {
        editMode: false, fromProduct: true,
      }
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.lineaList = [d, ...this.lineaList];
        this.productForm.get('lineaId').setValue(d.id);
      }
    });
  }

  addBrand() {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    const dialogRef = this.matDialog.open(BrandFormModalComponent, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
      data: {
        editMode: false, fromProduct: true,
      }
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.brandList = [d, ...this.brandList];
        this.productForm.get('brandId').setValue(d.id);
      }
    });
  }

  addTag() {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    const dialogRef = this.matDialog.open(TagFormModalComponent, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
      data: {
        editMode: false, fromProduct: true,
      }
    });
    dialogRef.afterClosed().subscribe(d => {
      if (d) {
        console.log(d);
        this.tags = [d, ...this.tags];
        console.log(this.tags);
      }
    });
  }


  openDetails() {
    this.dRef = this.matDialog.open(ProductHistoryComponent,
      {
        disableClose: false,
        autoFocus: true,
        width: '1100px',
        maxHeight: '80%',
        data: this.productDetails
      });
  }

  openListini(listini) {
    this.priceListService.getByProductId(this.product.id).subscribe(u => {
      if (u != null) {
        this.listPrice.push(u);
      }
    });
    const listiniref = this.matDialog.open(listini,
      {
        disableClose: false,
        autoFocus: true,
        width: '1100px',
        maxHeight: '80%',
      });
    listiniref.afterClosed().subscribe((d) => {
      if (d) {
        this.listPrice = [];
      }
    });
  }

  editListini(event, r: PriceList) {
    const dialogRef = this.matDialog.open(PriceListFormComponent, {
      width: '900px',
      autoFocus: true,
      disableClose: true,
      data: {
        editMode: true,
        priceList: r,
      }
    });
    dialogRef.afterClosed().subscribe((d) => {
      if (d) {
        this.listPrice = [];
        this.priceListService.getByProductId(this.product.id).subscribe(u => {
          if (u != null) {
            this.listPrice.push(u);
          }
        });
      }
    });
  }

  deleteListini($event, priceList: PriceList) {
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE'))
      .then(res => {
        if (res.value) {
          this.priceListService.delete(priceList.id).subscribe(r => {
            this.showSnackBar({
              text: ``,
              actionIcon: 'delete',
              actionMsg: this.translate.instant('DIALOG.DELETE_SUCCESS')
            });
            this.listPrice = [];
          }, err => {
            if (err.status === 500) {
              this.showSnackBar({
                text: ``,
                actionIcon: 'failed',
                actionMsg: this.translate.instant('DIALOG.CANNOT_DELETE')
              });
            }
          });
        }
      });
  }

  getPrintInterface(content, mode) {
    this.printMode = mode;
    this.dialogRef = this.matDialog.open(content, {minWidth: 400});
    this.dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.printTicketSent = true;
        if (mode === 'FACE_PLATES') {
          const request = {
            products: [{
              description: this.productForm.get('description').value,
              price: this.productForm.get('price').value,
              barCode: this.getDefaultProductCode().code
            }],
            ticketQuantity: d,
            type: this.selectedType,
          };
          this.productService.printFacePlates(request).subscribe(data => {
            this.printTicketSent = false;
            const downloadUrl = window.URL.createObjectURL(data.body);
            window.open(downloadUrl);
          }, error => {
            this.printTicketSent = false;
            this.sweetAlertService.notification(this.translate.instant('PAYMENT.PRINT_FAILED'));
          });
        } else {
          const request = {
            description: this.productForm.get('description').value,
            barCode: this.getDefaultProductCode().code,
            price: this.productForm.get('price').value,
            ticketQuantity: d,
            type: this.selectedType,
          };
          this.productService.printTicket(request).subscribe(data => {
            this.printTicketSent = false;
            const downloadUrl = window.URL.createObjectURL(data.body);
            window.open(downloadUrl);
          }, error => {
            this.printTicketSent = false;
            this.sweetAlertService.notification(this.translate.instant('PAYMENT.PRINT_FAILED'));
          });
        }
        this.ticketNumber = 1;
      }
    });
  }


  add() {
    const priceList: PriceList = {
      product: this.product,
      productId: this.product.id,
      // productDescription: this.product.description,
      productCode: this.product.productCodes.filter(e => e.defaultCode === true)[0].code
    };
    const dialogRef = this.matDialog.open(PriceListFormComponent, {
      width: '900px',
      autoFocus: true,
      disableClose: true,
      data: {
        editMode: true,
        priceList: priceList,
      }
    });
    dialogRef.afterClosed().subscribe((d) => {
      if (d) {
        this.priceListService.getByProductId(this.product.id).subscribe(u => {
          if (u != null) {
            this.listPrice.push(u);
          }
        });
      }
    });
  }

  translateTypes() {
    this.types = this.printMode === 'TICKET' ? [
      {description: this.translate.instant('PRODUCT_FORM.' + ProductBarcodeType.LIST), id: ProductBarcodeType.LIST},
      {
        description: this.translate.instant('PRODUCT_FORM.' + ProductBarcodeType.ONE_PER_PAGE),
        id: ProductBarcodeType.ONE_PER_PAGE
      }
    ] : [
      {description: this.translate.instant('PRODUCT_FORM.' + ProductBarcodeType.A4_62_32), id: ProductBarcodeType.LIST},
      {
        description: this.translate.instant('PRODUCT_FORM.' + ProductBarcodeType.CONTINUOUS_63_37),
        id: ProductBarcodeType.CONTINUOUS_63_37
      }
    ];
  }


  getLazyUm(request) {
    this.loading = true;
    this.umService.getAllLazy(request).subscribe(d => {
      this.um = [...this.um, ...d.data];
      this.umPage++;
      this.loading = false;
    });
  }

  getUms() {
    this.umService.getAll().subscribe(r => {
      this.um = r;
    });
  }

  // UM
  clear() {
    this.reset();
    this.getLazyUm({page: this.umPage, pageSize: 10, textSearch: this.searchValue});
  }

  reset() {
    this.um = [];
    this.umPage = 1;
    this.searchValue = null;
  }

  open() {
    this.reset();
    this.getLazyUm({page: this.umPage, pageSize: 10});
  }


  searchUm(event) {
    this.searchValue = event.term;
    this.reset();
    this.getLazyUm({page: this.umPage, pageSize: 10, visible: true, textSearch: this.searchValue});
  }

  // um

  openFormDialog(content) {
    if (this.editMode && !this.editClicked) {
      return;
    }
    //  this.getProducts();
    this.dialogRef = this.matDialog.open(content, {
      width: '80%',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    this.dialogRef.afterClosed().subscribe(d => {
      this.productUmForm.reset();
      //   this.search({ page: this.page, pageSize: this.pageSize, textSearch: this.searchFormControl.value });
    });
  }

  addProductCode(content) {
    this.productCodeForm.get('defaultCode').setValue(true);
    this.productCodeForm.get('defaultCode').enable();
    this.productCodeForm.get('defaultCode').updateValueAndValidity();
    if (this.isDefaultProductCodeExist()) {
      this.productCodeForm.get('defaultCode').setValue(false);
      this.productCodeForm.get('defaultCode').disable();
      this.productCodeForm.get('defaultCode').updateValueAndValidity();
    }
    this.dialogRef = this.matDialog.open(content, {
      width: '80%',
      //  height: '50vh',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    this.dialogRef.afterClosed().subscribe(d => {
      this.productCodeForm.reset();
    });
  }

  saveUm() {
    if (!this.productUmForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    if (this.product) {
      this.productUmForm.get('productId').setValue(this.product.id);
    }
    this.productUmForm.get('um').setValue(this.ums.filter(e => e.id === this.productUmForm.get('umId').value)[0]);
    if (this.productUmForm.get('index').value == null) {
      this.productUmForm.get('index').setValue(this.rows.length);
      this.rows.push(this.productUmForm.getRawValue());
    } else {
      this.rows[this.productUmForm.get('index').value] = this.productUmForm.getRawValue();
    }
    this.dialogRef.close(true);
  }

  edit(content, pum) {
    this.um = this.ums;
    this.productUmForm.patchValue(pum);
    this.productUmForm.get('umId').setValue(pum.um.id);
    this.dialogRef = this.matDialog.open(content, {
      width: '80%',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false}
    });
    this.dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.productUmForm.reset();
      }
    });
  }

  delete(pum) {
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + pum.description).then(e => {
      if (e.value) {
        this.rows.splice(pum.index, 1);
      }
    });
  }

  translateProductCodeTypes() {
    this.productCodeTypes = [{description: ProductCodeType.CODE, id: ProductCodeType.CODE},
      {description: ProductCodeType.BARCODEEAN8, id: ProductCodeType.BARCODEEAN8},
      {description: ProductCodeType.BARCODEEAN13, id: ProductCodeType.BARCODEEAN13},
      {description: ProductCodeType.SUPPLIER, id: ProductCodeType.SUPPLIER},
      {description: ProductCodeType.CUSTOMER, id: ProductCodeType.CUSTOMER}];
  }

  saveProductCode() {
    if (!this.productCodeForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    if (!this.validBarcode) {
      this.sweetAlertService.warning(this.translate.instant('PRODUCT_FORM.INVALID_BARCODE'));
      return;
    }
    if (this.product) {
      this.productCodeForm.get('productId').setValue(this.product.id);
    }
    if (this.productCodeForm.get('index').value == null) {
      this.productCodeForm.get('index').setValue(this.altProdCodes.length);
      this.altProdCodes.push(this.productCodeForm.getRawValue());
    } else {
      const index = this.altProdCodes.findIndex(u => u.index === this.productCodeForm.get('index').value);
      this.altProdCodes[index] = this.productCodeForm.getRawValue();
    }
    this.dialogRef.close(true);
  }


  editProductCode(content, pc) {
    this.productCodeForm.patchValue(pc);
    this.productCodeForm.get('defaultCode').enable();
    this.productCodeForm.get('defaultCode').updateValueAndValidity();
    if (this.isDefaultProductCodeExist() && !this.productCodeForm.get('defaultCode').value) {
      this.productCodeForm.get('defaultCode').disable();
      this.productCodeForm.get('defaultCode').updateValueAndValidity();
    }
    this.dialogRef = this.matDialog.open(content, {
      width: '80%',
      height: '50vh',
      autoFocus: true,
      disableClose: true,
      //  data: { editMode: false }
    });
    this.dialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.productCodeForm.reset();
      }
    });
  }

  deleteProductCode(pc) {
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + pc.code).then(e => {
      if (e.value) {
        this.altProdCodes.splice(pc.index, 1);
        this.altProdCodes.forEach((i, index) => {
          i.index = index;
        });
      }
    });
  }

  isDefaultProductCodeExist() {
    return (this.altProdCodes.filter(e => e.defaultCode === true).length > 0);
  }

  getDefaultProductCode() {
    return this.altProdCodes.filter(e => e.defaultCode === true)[0];
  }

  getDefaultCode(product: Product) {
    if (!product || (!product.productCodes || !product.productCodes.length)) {
      return null;
    }
    return product.productCodes.filter(e => e.defaultCode === true)[0];
  }

  getEanCode(product: Product) {
    if (!product || (!product.productCodes || !product.productCodes.length)) {
      return null;
    }
    const code = product.productCodes.filter(e => e.codeType === ProductCodeType.BARCODEEAN8
      || e.codeType === ProductCodeType.BARCODEEAN13);
    if (!code || !code.length) {
      return null;
    }
    return code[0].code;
  }

  showCodes(codesTemlpate) {
    this.altProdCodes = this.product.productCodes;
    const dialogRefTranslation = this.matDialog.open(codesTemlpate, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
    });
    dialogRefTranslation.afterClosed().subscribe(d => {
      this.altProdCodes = [];
    });
  }

  checkValidEan(): boolean {
    this.validBarcode = true;
    this.uniqueBarcode = true;
    if (this.productCodeForm.get('codeType').value !== ProductCodeType.BARCODEEAN13
      && this.productCodeForm.get('codeType').value !== ProductCodeType.BARCODEEAN8) {
      return true;
    }
    const c = this.productCodeForm.get('code').value;
    if (c && this.productCodeForm.get('codeType').value === ProductCodeType.BARCODEEAN8 && c.length !== 8) {
      this.validBarcode = false;
      return false;
    }
    if (c && this.productCodeForm.get('codeType').value === ProductCodeType.BARCODEEAN13 && c.length !== 13) {
      this.validBarcode = false;
      return false;
    }
    this.barCodeService.validateEAN({code: this.productCodeForm.get('code').value}).subscribe(res => {
      if (!res) {
        this.validBarcode = false;
        return false;
      }
      this.validBarcode = true;
      return true;
      // });
    });

  }


  addDescription() {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    const dialogRefTranslation = this.matDialog.open(GenericTranslationComponent, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
      data: {
        editMode: true, editClicked: true, list: this.productForm.get('description').value,
      }
    });
    dialogRefTranslation.afterClosed().subscribe(d => {
      if (d) {
        this.productForm.controls.description = this.setDescription(d);
        this.descriptionByLang.setValue(this.setDescriptionByLang(this.productForm.controls.description.value).description);
        if (!this.editMode) {
          this.productForm.controls.commercialDescription = this.setDescription(d);
          this.commercialDescriptionByLang.setValue(this.setDescriptionByLang(this.productForm.controls.commercialDescription.value).description);
        }
      }
    });
  }

  addCommercialDescription() {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    const dialogRefTranslation = this.matDialog.open(GenericTranslationComponent, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
      data: {
        editMode: true,
        editClicked: true,
        list: this.productForm.get('commercialDescription').value,
      }
    });
    dialogRefTranslation.afterClosed().subscribe(d => {
      if (d) {
        this.productForm.controls.commercialDescription = this.setDescription(d);
        this.commercialDescriptionByLang.setValue(
          this.setDescriptionByLang(this.productForm.controls.commercialDescription.value).description);
      }
    });
  }


  existsAtLeastOneDescription(arr: any[]) {
    console.log(arr);
    if (arr === undefined) {
      return 0;
    }
    let i = 0;
    arr.forEach(element => {
      if (element.description != null) {
        i++;
      }
    });
    return i;
  }


  setDescriptionByLang(list: any[]) {
    return list.filter(e => e.langCode === this.translationLoader.getActiveLanguage())[0];
  }

  setTagDescription(tag: Tag) {
    return tag.tagTranslationDtos.find(e => e.langCode === this.translationLoader.getActiveLanguage()).description;
  }


  setDescription(list: any[]) {
    const descriptionControl = new FormArray([]);
    list.forEach(e => {
      descriptionControl.push(this.fb.group({
        description: new FormControl(e.description),
        langCode: new FormControl(e.langCode),
        langCodeId: new FormControl(e.langCodeId)
      }));
    });
    return descriptionControl;
  }

  setCommercialDescription(list: any[]) {
    const descriptionControl = new FormArray([]);
    list.forEach(e => {
      descriptionControl.push(this.fb.group({
        description: new FormControl(e.commercialDescription),
        langCode: new FormControl(e.langCode),
        langCodeId: new FormControl(e.langCodeId)
      }));
    });
    return descriptionControl;
  }


  setOriginalDescription(list: any[]) {
    const descriptionControl = new FormArray([]);
    list.forEach(e => {
      descriptionControl.push(this.fb.group({
        description: new FormControl(e.originalDescription),
        langCode: new FormControl(e.langCode),
        langCodeId: new FormControl(e.langCodeId)
      }));
    });
    return descriptionControl;
  }


  onFileInput(event) {
    console.log(event.currentTarget.files);
  }

  addPack(content) {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    this.dialogRefPack = this.matDialog.open(content, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
    });
    this.dialogRefPack.afterClosed().subscribe(d => {
      if (d) {
        this.packs = [this.packForm.getRawValue(), ...this.packs];
      }
      this.packForm.reset();
    });
  }

  cancelPack(i: number) {
    if (this.productForm.controls.id.value && !this.editClicked) {
      return;
    }
    this.packs.splice(i, 1);
  }

  changeInEvidenza(product: Product) {
    this.productService.changeInEvidenzaState(product.id).subscribe(r => {
      product.inEvidenza = !product.inEvidenza;
    });
  }

  private mapColorSize() {
    this.colors = [];
    this.sizes = this.product.sizes;
    this.product.colors.forEach(c => {
      let sizes = [];
      this.sizes.forEach(ss => {
        sizes = [...sizes, {stock: 0, price: 0}];
      });
      const s = {code: c.code, name: c.name, sizes, valId: c.valId};
      if (this.colors.indexOf(s) === -1) {
        this.colors = [...this.colors, s];
      }
    });
    // const v = this.product.sharedVariationList[0].variationValueList[0];
    this.product.sharedVariationList[0].variationValueList.forEach(v => {
      const ii = this.colors.filter(u => u.valId === v.colorId).shift();
      const i = this.colors.indexOf(ii);
      if (i !== -1) {
        const jj = this.sizes.filter(u => u.valId === v.sizeId).shift();
        const j = this.sizes.indexOf(jj);
        if (j !== -1) {
          this.colors[i].sizes[j].stock = v.stock[0].stock;
          this.colors[i].sizes[j].price = v.stock[0].price;
        }
      }
    });
  }

  getProductResources(productId: number) {
    this.productResourceService.getProductResources(productId, 'local').subscribe((resources) => {
      this.localResources = resources;
      if (!this.product.mainImage && this.localResources.length == 1) {
        this.product.mainImage = this.localResources[0].url;
      }
    });
    this.productResourceService.getProductResources(productId, 'sellpoint').subscribe((resources) => {
      this.sellPointResources = resources;
    });
  }

  setMainImage(url: string) {
    this.productResourceService.setMainImage(this.product.id, url).subscribe((response) => {
      if (response.status === 200) {
        this.product.mainImage = url;
      }
    });
  }


  unsetMainImage() {
    this.productResourceService.unsetMainImage(this.product.id).subscribe((response) => {
      this.product.mainImage = null;
    });
  }

  deleteImage(name: string) {
    console.log('name = ', name);
    this.productResourceService.deleteImage(this.product.id, name).subscribe((response) => {
      if (response.status === 200) {
        this.getProductResources(this.product.id);
      }
    });
  }

  openImageCropper() {
    this.matDialog.open(CropImageComponent, {
      width: '1200px',
      disableClose: true
    }).afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.matDialog.open(ProductImageFormComponent, {
            width: '400px',
            disableClose: true,
            data: {
              file: res,
              productId: this.product.id,
            }
          }).afterClosed()
            .pipe(take(1))
            .subscribe(r => {
              console.log("resp add image = ", r);
                if (r) {
                  this.getProductResources(this.product.id);
                }
              }
            );
        }
      });
  }
}
