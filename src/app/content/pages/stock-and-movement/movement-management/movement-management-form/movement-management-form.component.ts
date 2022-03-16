import {Component, Inject, OnInit} from '@angular/core';
import {Movement} from '../../../../../shared/models/movement';
import {Subject} from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MovementProduct} from '../../../../../shared/models/movement-product';
import {MovementType} from '../../../../../shared/enum/movement-type';
import {TranslateService} from '@ngx-translate/core';
import {MovementMgmService} from '../../../../../shared/services/movement-mgm.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {PaymentMethodsType} from '../../../../../shared/enum/payment-methods-type';
import {Product} from '../../../../../shared/models/product';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {ProductMgmService} from '../../../../../shared/services/product-mgm.service';
import {TranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {SweetAlertService} from '../../../../../shared/services/sweet-alert.service';
import {TransactionRow} from '../../../../../shared/models/transaction/transaction-row';
import {Transaction} from '../../../../../shared/models/transaction/transaction';
import {PurchaseRow} from '../../../../../shared/models/purchase/purchase-row';
import {Purchase} from '../../../../../shared/models/purchase/purchase';
import {PriceService} from '../../../../../shared/services/price-service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-movement-management-form',
  templateUrl: './movement-management-form.component.html',
  styleUrls: ['./movement-management-form.component.scss']
})
export class MovementManagementFormComponent implements OnInit {
  movement: Movement;
  appRef;
  dialogComponentRef;
  unsubscribe1$ = new Subject();
  unsubscribe2$ = new Subject();
  onClose = new Subject();
  editMode;
  editClicked = false;
  movementForm: FormGroup;
  newProdForm: FormGroup;
  columns = [' ', 'PRODUCT_FORM.CODE', 'MOVEMENT_FORM.DESCRIPTION', 'MOVEMENT_FORM.QUANTITY', 'PRODUCT_FORM.MEASURE_UNIT'];
  rows: MovementProduct[] = [];
  payments = [];
  types = [];
  unsubscribe$ = new Subject();
  disableSave = false;
  file: FormData = new FormData();
  products: Product[] = [];
  productSearch$ = new Subject<string>();
  editProduct = false;
  paymentDialog: any;
  rowList: PurchaseRow[];
  purchase: Purchase;
  stockType: string;
  data: any;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<MovementManagementFormComponent>,
    private matDialog: MatDialog,
    private movementMgmService: MovementMgmService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar, private productService: ProductMgmService,
    private translationLoader: TranslationLoaderService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    public priceService: PriceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editMode = true;
        this.getMovement(params.id);
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnInit() {
    this.translateTypes();
    this.translatePayment();
    this.initForm();
    this.loadProducts();
    this.productSearch$.pipe(debounceTime(500)).subscribe(term => {
      this.loadProducts(term.trim());
    });
    if (!this.editMode) {
      this.movementMgmService.getNextNumber().subscribe(d => {
        this.movementForm.get('number').setValue(('0000' + d).slice(-4), {emitEvent: false});
      });
    }
  }

  loadProducts(term?) {
    this.productService.getLazyProductList({page: 1, pageSize: 10, textSearch: term}).subscribe(d => {
      d.data.forEach(p => {
        p.translatedDesc = (p.code ? p.code : '') + ' ' + this.setDescriptionByLang(p.transInfo);
      });
      this.products = [...d.data];
    });
  }

  setDescriptionByLang(list: any[]) {
    if (!list) {
      return '';
    }
    const tr = list.filter(e => e.langCode === this.translationLoader.getActiveLanguage());
    if (tr && tr.length) {
      return tr[0].description;
    }
    return '';
  }

  closeForm() {
    // this.dialogRef.close();
  }

  save() {
    if (!this.productsForm.controls.length) {
      this.sweetAlertService.warning(this.translate.instant('DIALOG.NO_PRODUCT_INSERTED'))
        .then(res => {
        });
      return;
    }
    if (!this.movementForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {
      });
      return;
    }
    this.disableSave = true;
    this.movementMgmService.create(this.movementForm.getRawValue()).subscribe(d => {
      this.sweetAlertService.success(this.translate.instant('DIALOG.ADD_SUCCESS'));
      this.router.navigate(['/movement-mgm']);
    }, error => this.disableSave = false);
  }

  get quantityPieceForm() {
    return this.movementForm.get('totalQuantityPiece') as FormControl;
  }

  get quantityGRForm() {
    return this.movementForm.get('totalQuantityGR') as FormControl;
  }

  get quantityMLForm() {
    return this.movementForm.get('totalQuantityML') as FormControl;
  }

  translateTypes() {
    this.types = [{description: this.translate.instant('MOVEMENT_FORM.' + MovementType.LOAD), id: MovementType.LOAD},
      {description: this.translate.instant('MOVEMENT_FORM.' + MovementType.UNLOAD), id: MovementType.UNLOAD}];
  }

  translateAdvancedTypes() {
    this.types = [{description: this.translate.instant('MOVEMENT_FORM.' + MovementType.LOAD), id: MovementType.LOAD},
      {description: this.translate.instant('MOVEMENT_FORM.' + MovementType.UNLOAD), id: MovementType.UNLOAD},
      {description: this.translate.instant('MOVEMENT_FORM.' + MovementType.SALE), id: MovementType.SALE},
      {description: this.translate.instant('MOVEMENT_FORM.' + MovementType.RESE), id: MovementType.RESE}];
  }

  translatePayment() {
    this.payments = [{description: this.translate.instant('MOVEMENT_FORM.' + PaymentMethodsType.CASH), id: PaymentMethodsType.CASH},
      {description: this.translate.instant('MOVEMENT_FORM.' + PaymentMethodsType.CHEQUE), id: PaymentMethodsType.CHEQUE},
      {description: this.translate.instant('MOVEMENT_FORM.' + PaymentMethodsType.CREDIT_CARD), id: PaymentMethodsType.CREDIT_CARD}];
  }

  get productsForm() {
    return this.movementForm.get('products') as FormArray;
  }


  delete($event: MouseEvent, product) {
    this.productsForm.controls.splice(this.productsForm.controls.indexOf(product), 1);
    this.productsForm.value.splice(this.productsForm.value.indexOf(product), 1);
    this.productsForm.controls.forEach(p => {
      p.get('seq').setValue(this.productsForm.controls.indexOf(p) + 1);
    });
    this.updateTotalQuantity();
  }

  private initForm() {
    this.movementForm = new FormGroup({
      id: new FormControl(),
      date: new FormControl(new Date(), Validators.required),
      number: new FormControl(null),
      type: new FormControl(null, Validators.required),
      note: new FormControl(null),
      // paymentMethod: new FormControl(this.payments[0].id, Validators.required),
      // client: new FormControl(null),
      totalQuantityPiece: new FormControl(null),
      totalQuantityML: new FormControl(null),
      totalQuantityGR: new FormControl(null),
      // draft: new FormControl(false),
      products: this.formBuilder.array([], Validators.required)
    });
    this.initProdForm();
  }

  initProdForm() {
    this.newProdForm = new FormGroup({
      productId: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      editMode: new FormControl(false),
      prodCode: new FormControl(null),
      prodDescription: new FormControl(null),
      seq: new FormControl(null),
      unit: new FormControl(null),
      stockType: new FormControl(null),
    });
    this.newProdForm.get('productId').valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(c => {
      this.stockType = '';
      if (c) {
        const product = this.products.filter(u => u.id === c).shift();
        this.newProdForm.get('prodDescription').setValue(this.setDescriptionByLang(product.transInfo));
        this.newProdForm.get('quantity').setValue(1);
        this.newProdForm.get('prodCode').setValue(product.code);
        this.newProdForm.get('unit').setValue(product.weighted ? product.weightUm : null);
        this.stockType = product.weighted ? '(' + product.measureUnit.description + ')' : '';
        this.newProdForm.get('stockType').setValue(product.weighted ? product.measureUnit.description : '');
      }
    });
    this.updateTotalQuantity();
  }

  editProd(prod) {
    this.newProdForm.patchValue(prod.value);
    this.newProdForm.get('editMode').setValue(true);
    this.stockType = prod.get('stockType').value;

  }

  addProduct() {
    const d = this.newProdForm.value;
    const index = this.productsForm.value.findIndex(u => u.productId === d.productId);
    if (index === -1) {
      d.seq = (this.productsForm.length + 1).toString();
      this.productsForm.insert(0, this.formBuilder.group(d));
      this.initProdForm();
      return;
    }
    const control = this.productsForm.controls[index];
    control.get('prodDescription').setValue(d.description);
    control.get('quantity').setValue(1);
    control.get('prodCode').setValue(d.prodCode);
    control.get('quantity').setValue(d.quantity);
    control.get('unit').setValue(d.unit);
    this.newProdForm.get('productId').setValue(null);
    this.initProdForm();
  }

  private updateTotalQuantity() {
    const totalQuantityGR = this.productsForm.value.reduce((acc, el) => acc + (el.unit === 'GR' ? Number(el.quantity) : 0), 0);
    const totalQuantityML = this.productsForm.value.reduce((acc, el) => acc + (el.unit === 'ML' ? Number(el.quantity) : 0), 0);
    const totalQuantityPiece = this.productsForm.value.reduce((acc, el) => acc + (!el.unit ? Number(el.quantity) : 0), 0);
    this.quantityPieceForm.setValue(totalQuantityPiece);
    this.quantityGRForm.setValue(totalQuantityGR);
    this.quantityMLForm.setValue(totalQuantityML);
  }

  openTransactionDetails(transactionContent: any) {
    this.paymentDialog = this.matDialog.open(transactionContent, {
      width: '65%',
      maxHeight: '80vh',
      autoFocus: true,
      disableClose: false,
    });
  }

  getMovement(id: any) {
    this.movementMgmService.findById(id).subscribe(r => {
      this.initMovement(r);
    });
  }

  initMovement(movement) {
    this.movement = movement;
    this.translateAdvancedTypes();
    this.movementForm.patchValue(this.movement, {emitEvent: false});
    this.movement.products.forEach(p => {
      const control = this.formBuilder.group(p);
      this.productsForm.insert(this.movement.products.indexOf(p), control);
      this.movementForm.get('number').setValue(('0000' + this.movement.number).slice(-4));
    });
    this.movementForm.disable();
    this.updateTotalQuantity();
    this.purchase = this.movement.purchase;
    if (this.purchase) {
      this.rowList = this.purchase.purchaseRowList;
    }

  }
}
