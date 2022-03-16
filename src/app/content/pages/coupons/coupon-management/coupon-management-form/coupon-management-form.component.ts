import {Component, OnInit, Output, EventEmitter, ViewChild, ChangeDetectorRef, AfterViewChecked} from '@angular/core';
import {CouponType} from '../../../../../shared/enum/coupon-type';
import {TranslateService} from '@ngx-translate/core';
import {CouponConditionType} from '../../../../../shared/enum/couponCondition-Type';
import {PromotionType} from '../../../../../shared/enum/promotion-type';
import {DiscountType} from '../../../../../shared/enum/discount-type';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {CheckListService} from '../../../../../shared/util/check-list-service';
import {Product} from '../../../../../shared/models/product';
import {CouponService} from '../../../../../shared/services/coupon.service';
import {Router} from '@angular/router';
import {TranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {MatSnackBar} from '@angular/material';
import {SweetAlertService} from '../../../../../shared/services/sweet-alert.service';
import {CouponClient} from '../../../../../shared/dto/couponClient';
import {Client} from '../../../../../shared/models/client';
import {ClientPageRequest} from '../../../../../shared/dto/client-page-request';
import {SearchResponse} from '../../../../../shared/dto/search-response';
import {ClientMgmService} from '../../../../../shared/services/client-mgm.service';
import {Category} from '../../../../../shared/models/category';
import {ProductLazyRequest, ProductMgmService} from '../../../../../shared/services/product-mgm.service';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {TodoItemNode} from '../../../../../shared/util/todo-item-node';
import {TodoItemFlatNode} from '../../../../../shared/util/todo-item-flat-node';
import {FlatTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import {TreeNode} from '@angular/router/src/utils/tree';
import {Subscription} from 'rxjs';
import {MessageService} from '../../../../../shared/services/message.service';
import {BreadcrumbService} from '../../../../../core/services/breadcrumb.service';
import {Coupon} from '../../../../../shared/models/coupon';
import {FilterClientsComponent} from '../../../promotion/filter-clients/filter-clients.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
 import {PromoType} from '../../../../../shared/enum/promo-type';

@Component({
  selector: 'app-coupon-management-form',
  templateUrl: './coupon-management-form.component.html',
  styleUrls: ['./coupon-management-form.component.scss'],
  providers: [CheckListService]
})
export class CouponManagementFormComponent implements OnInit, AfterViewChecked {
  messages: any[] = [];
  subscription: Subscription;
  types = [];
  conditionTypes = [];
  promotionTypes = [];
  discountTypes = [];
  selectedValue = '';
  couponForm: FormGroup;
  promotionControl = '';
  discountControl = '';
  coupon: Coupon = null;
  editMode = false;
  categoryPdt: string ;
  client: string ;
  couponClient: CouponClient[] = [];
  listCategory: number[];
  clients: Client[];
  products: Product[];
  categories: Category[];
  request: ClientPageRequest;
  requestProduct: ProductLazyRequest;
  clientResponse: SearchResponse<Client>;

  selectedClients: Client[] = [];
  selectedProducts: Product[] = [];

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  /**** nodes ***************************/
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

   /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  todayDate: Date = new Date();
  editClicked = false;
  disableSave = false;
  promoForm: FormGroup;
  constructor(private translate: TranslateService, private _database: CheckListService,
              private couponService: CouponService,  private router: Router, private translationLoader: TranslationLoaderService,
              public snackBar: MatSnackBar, private sweetAlertService: SweetAlertService,
              private clientService: ClientMgmService, private productService: ProductMgmService, private messageService: MessageService,
              private breadcrumbService: BreadcrumbService,  private matDialog: MatDialog, private ref: ChangeDetectorRef) {

    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        this.messages.push(message);
        this.editMode = message[0];
        this.coupon = message[1];
        localStorage.setItem('editMode', JSON.stringify(this.editMode));
        localStorage.setItem('coupon', JSON.stringify(this.coupon));
      } else {
        this.messages = [];
        this.editMode = JSON.parse(localStorage.getItem('editMode'));
        this.coupon = JSON.parse(localStorage.getItem('product'));
      }
      this.sendBreadCrumb();
    });

  }


  ngOnInit() {

    this.requestProduct = new ProductLazyRequest();
    this.requestProduct.page = 1;
    this.requestProduct.pageSize = 10;
    this.getLazyProduct();

    // this.request = new ClientPageRequest();
    // this.request.page = 1;
    // this.request.pageSize = 10;
    // this.request.textSearch = '';
    // this.getClients();

    this.initCouponForm();
    this.translateTypes();
    this.translateConditionTypes();
    this.translatePromotionTypes();
    this.translateDiscountTypes();
    this.initCategoryTree();


    if (this.editMode) {
     this.couponForm.get('couponId').setValue(this.coupon.couponId);
      this.couponForm.get('code').setValue(this.coupon.code);
      this.couponForm.get('description').setValue(this.coupon.description);
      this.couponForm.get('dateFrom').setValue(this.coupon.dateFrom);
      this.couponForm.get('dateTo').setValue(this.coupon.dateTo);
      this.couponForm.get('couponType').setValue(this.coupon.couponType);
      this.couponForm.get('maxNumberUse').setValue(this.coupon.maxNumberUse);
      this.couponForm.get('discountType').setValue(this.coupon.discountType);
      this.couponForm.get('discount').setValue(this.coupon.discount);
      this.couponForm.get('couponConditionType').setValue(this.coupon.couponConditionType);
      this.couponForm.get('promotionType').setValue(this.coupon.promotionType);
      this.couponForm.get('promo').setValue(this.coupon.promo);
      this.couponForm.get('minAmountOrder').setValue(this.coupon.minAmountOrder);
      this.couponForm.get('minProductQuantity').setValue(this.coupon.minProductQuantity);

      this.promotionControl = this.coupon.promotionType.toString();
      this.discountControl =  this.coupon.discountType.toString();

       // get products
      if ( this.coupon.products.length > 0) {
        this.categoryPdt = 'PRODUCT';
        this.selectedProducts = this.coupon.products;
        this.selectedProducts.forEach(e1 => {
          e1.commercialDescription = this.setDescriptionByLang(e1.transInfo).description ;
        });
       }

      // get clients
      if ( this.coupon.clients.length > 0) {
        this.client = 'BYPERSON';
        this.coupon.clients.forEach(e => {
          this.selectedClients = [...this.selectedClients, e.client];
        });
      }
       this.couponForm.disable();

    }


    this.promoForm = new FormGroup({
      id: new FormControl(),
      seq: new FormControl(),
      type: new FormControl(PromoType.MAIL, Validators.required),
      promoModelId: new FormControl(null, Validators.required),
      object: new FormControl(null, Validators.required),
      message: new FormControl(null, Validators.required),
      clientsId: new FormArray([]),
      shareFacebook: new FormControl(false),
      shareInstagram: new FormControl(false),
    });

    }

  ngAfterViewChecked(){
    this.ref.detectChanges();
  }

  initCouponForm() {
    this.couponForm = new FormGroup({
      couponId: new FormControl(),
      code: new FormControl(null, Validators.required),
      description: new FormControl(null),
      discount: new FormControl(0, [Validators.required, Validators.min(1)]),
      minProductQuantity: new FormControl(0),
      minAmountOrder: new FormControl(0),
      promo: new FormControl(false),
      dateFrom: new FormControl(null, Validators.required),
      dateTo: new FormControl(null, Validators.required ),
      maxNumberUse: new FormControl(0),
      actualNumberUse: new FormControl(0),
      couponType: new FormControl(null, Validators.required),
      couponConditionType: new FormControl(null, Validators.required),
      discountType: new FormControl(null, Validators.required),
      promotionType: new FormControl(null, Validators.required),
      products: new FormControl([])

    }) ;
  }


  sendBreadCrumb(): void {
    if (this.editMode) {
      this.breadcrumbService.sendBreadcrumb(['COUPON', 'LIST_COUPONS', 'UPDATE']);
      return;
    }
    this.breadcrumbService.sendBreadcrumb(['COUPON', 'LIST_COUPONS', 'NEW']);
  }

  deactivateform() {
   // this.sendMessage(false, null);
    this.router.navigate(['/coupon-mgm']);
  }

  /********* nodes functions ************/

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';


  initCategoryTree() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this._database.dataChange.subscribe(data => {
      this.sortCategory(data);
      data.forEach(c => {
        if (c.children && c.children.length) {
          this.sortCategory(c.children);
          c.children.forEach(cc => {
            if (cc.children && cc.children.length) {
              this.sortCategory(cc.children);
            }
          });
        }
      });
      this.dataSource.data = data;


      if (this.coupon && this.coupon.categories.length > 0) {
        this.checklistSelection.clear();
        this.categoryPdt = 'CATEGORY';
         for (const node of this.dataSource._flattenedData.getValue()) {
          const index = this.coupon.categories.findIndex(pcat => pcat.id === node.id);
           if (index >= 0) {
             this.treeControl.expandDescendants(node);
             this.checklistSelection.select(node);
            }

        }
      }
   });
  }

  sortCategory(cats: TodoItemNode[]) {
    cats.sort((a, b) => a.item.localeCompare(b.item));
    if (this.coupon) {
      cats.sort((a, b) => {
        const aCat = this.coupon.categories.filter(u => u.id === a.id || u.parentId === a.id || u.ppId === a.id).shift();
        const bCat = this.coupon.categories.filter(u => u.id === b.id || u.parentId === b.id || u.ppId === b.id).shift();
        if (!aCat) {
          return 1;
        }
        if (!bCat) {
          return -1;
        }
        return this.coupon.categories.indexOf(aCat) - this.coupon.categories.indexOf(aCat);
      });
    }
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);

    if (this.checklistSelection.isSelected(node)) {

      const desc = descendants.length > 0 && descendants.every( child => {
          this.checklistSelection.select(child);
          return true;
      });
    }
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

  filterChanged(filterText: string) {
    this._database.filter(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

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


  // getClients() {
  //   this.clientService.getClients(this.request).subscribe(
  //       (response) => {
  //         this.clientResponse = response;
  //         this.clients = this.clientResponse.data;
  //         this.clientResponse.totalRecords = response.totalRecords;
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //   );
  // }


   translateTypes() {
    this.types = Object.keys(CouponType)
      .filter(value => isNaN(Number(value)) === false)
      .map((key) => ({label: this.translate.instant('COUPON.' + CouponType[key]), value: CouponType[key].toString()}));
  }

  translateConditionTypes() {
    this.conditionTypes = Object.keys(CouponConditionType)
      .filter(value => isNaN(Number(value)) === false)
      .map((key) => ({label: this.translate.instant('COUPON.' + CouponConditionType[key]), value: CouponConditionType[key].toString()}));

  }

  translatePromotionTypes() {
    this.promotionTypes = Object.keys(PromotionType)
      .filter(value => isNaN(Number(value)) === false)
      .map((key) => ({label: this.translate.instant('COUPON.' + PromotionType[key]), value: PromotionType[key].toString()}));
  }

  translateDiscountTypes() {
    this.discountTypes = Object.keys(DiscountType)
      .filter(value => isNaN(Number(value)) === false)
      .map((key) => ({label: this.translate.instant('COUPON.' + DiscountType[key]), value: DiscountType[key].toString()}));
  }

  getProductCategoryList() {
    const productCategoryList: number[] = [];
     for (const node of this.checklistSelection.selected) {
      const indexNode = productCategoryList.findIndex(c => c === node.id);
      if (indexNode < 0) {
         productCategoryList.push(node.id);
      }
      }
    return productCategoryList;
  }



  activateEdit() {
    if (this.editMode) {
      this.editClicked = true;
      this.couponForm.enable();
    }
  }

  check(e: Client[]) {
    this.selectedClients = e;
  }

  checkPdt(e: Product[]) {
    this.selectedProducts = e;
  }

  save() {
    const productCategoryList: number[] = [];
       const coupon = this.couponForm.getRawValue();

      // save categories
      this.listCategory = this.getProductCategoryList();


    for (const node of this.checklistSelection.selected) {
      const indexNode = this.listCategory.findIndex(c => c === node.id);
      if (indexNode >= 0 ) {

        const descendants = this.treeControl.getDescendants(node);

        if (this.descendantsAllSelected(node) || (descendants.length === 0 && this.checklistSelection.isSelected(node))) {
           descendants.forEach(e => {
            this.listCategory.forEach((value, index) => {
              if ( value === e.id ) {
                this.listCategory.splice(index, 1 );
              }
            });
          });
         } else if (this.descendantsAllSelected(node)) {
          this.listCategory.splice(indexNode, 1 );
        }
      }
    }

    if (this.listCategory.length > 0) {
        const listCat: Category[] = [];
        for (let n = 0; n < this.listCategory.length; ++n) {
          const cat: Category = new Category();
           cat.id = this.listCategory[n];
           listCat.push(cat);
         }
       coupon.categories = listCat;
      }

      // save products
        coupon.products = this.selectedProducts;

      if ( this.selectedClients.length > 0) {
       const listCc: CouponClient[] = [];
         this.selectedClients.forEach(e => {
         const cc: CouponClient = new CouponClient();
         cc.client = e;
         listCc.push(cc);
         });
         coupon.clients = listCc;
       }

    if (!this.editMode) {
      this.couponService.addCoupon(coupon).subscribe(
        (response) => {
          if (response.status === 200) {
            this.sweetAlertService.success(this.translate.instant('DIALOG.ADD_SUCCESS'));
            this.router.navigate(['/coupon-mgm']);
           } else {
            this.sweetAlertService.danger(this.translate.instant('DIALOG.CODE_EXISTE'));
           }
        } ,
        (error) => {
          console.log('new coupon error = ', error);
          this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_ADD'));
        }
      );
    } else {

      if (this.promotionControl === 'SCONTONUMMINARTICOLI') {
        coupon.minAmountOrder = 0;
      } else if (this.promotionControl === 'SCONTOMINORDINE') {
        coupon.minProductQuantity = 0;
      }

      this.couponService.editCoupon(coupon).subscribe(
        (response) => {
          this.sweetAlertService.success(this.translate.instant('DIALOG.UPDATE_SUCCESS'));
          this.router.navigate(['/coupon-mgm']);
        } ,
        (error) => {
          console.log('update coupon error = ', error);
          this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_UPDATE'));
        }
      );

    }
  }


  getLazyProduct() {
    return this.productService.getLazyProductList(this.requestProduct).subscribe(data => {
      this.products = data.data;
      this.products.forEach(e1 => {
        e1.commercialDescription = this.setDescriptionByLang(e1.transInfo).description ;
       });
    });
  }

  setDescriptionByLang(list: any[]) {
    return list.filter(e => e.langCode === this.translationLoader.getActiveLanguage())[0];
  }



  compareTwoDates() {
    return new Date(this.couponForm.controls['dateTo'].value) >= new Date(this.couponForm.controls['dateFrom'].value);
    }


    displayTabs() {
    return this.categoryPdt === 'CATEGORY' || this.categoryPdt === 'PRODUCT' || this.client === 'BYPERSON'  ;
    }

    isValid() {
      return !( !this.compareTwoDates() ||  (this.client === 'BYPERSON' && this.selectedClients.length === 0)
                                        ||  (this.categoryPdt === 'CATEGORY' && this.getProductCategoryList().length === 0)
                                        ||  (this.categoryPdt === 'PRODUCT' && this.selectedProducts.length === 0))  ;
      }



    }

