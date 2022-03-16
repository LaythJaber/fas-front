import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {ConfigurationsService} from '../../../../shared/services/configurations.service';
import {MatDialog} from '@angular/material/dialog';
import {SweetAlertService} from '../../../../shared/services/sweet-alert.service';
import {BreadcrumbService} from '../../../../core/services/breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Category} from 'src/app/shared/models/category';
import {CategoryLazyRequest, CategoryService} from "../../../../shared/services/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryFormComponent} from "./category-form/category-form.component";
import {TranslationLoaderService} from "../../../../core/services/translation-loader.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {ImageService} from "../../../../shared/services/image.service";
import * as Inputmask from 'inputmask';
import {LocalStorageService} from 'ngx-webstorage';
import {LocalTranslate} from "../../../../shared/pipes/local-translate";

@Component({
  selector: 'app-category',
  templateUrl: './category-product.component.html',
  styleUrls: ['./category-product.component.scss']
})
export class CategoryProductComponent implements OnInit {

  @ViewChild('createAtElem') createAtElem: ElementRef;

  columns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.IMAGE',
    'DATA_TABLE.CODE',
    'DATA_TABLE.NAME',
    'DATA_TABLE.DESCRIPTION',
    'DATA_TABLE.STATUS',
    'DATA_TABLE.CREATED',
    'DATA_TABLE.UPDATED',
    'DATA_TABLE.SUBCATEGORY',
    ' ',
  ];

  filterForm: FormGroup;
  searchFormControl = new FormControl();
  visibilityFormControl = new FormControl();
  totalRecords: number;
  unsubscribe = new Subject();
  loading = true;

  categoryLazyRequest: CategoryLazyRequest = new CategoryLazyRequest();
  pageSizesValues = [5, 10, 15, 25, 50, 75, 100, 150];
  categoryList: Category[] = [];

  dialogRef: any;
  selectedCategory: Category = null;
  breadCrumbCategory: Category = null;

  siteActiveLanguage;

  triForm: FormGroup;
  subCategoryList: Category[] = [];


  constructor(
    private configurationsService: ConfigurationsService,
    private matDialog: MatDialog,
    private sweetAlertService: SweetAlertService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    public modal: NgbModal,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translationLoaderService: TranslationLoaderService,
    private imageService: ImageService,
    private localStorageService: LocalStorageService,
    private localTranslate: LocalTranslate
  ) {
    this.siteActiveLanguage = this.translationLoaderService.getActiveLanguage();
  }

  ngOnInit() {
    this.translationLoaderService.siteLanguage.subscribe((l) => {
      this.siteActiveLanguage = l;
      this.translateCBC();
    });
    this.sendBreadCrumb();
    this.initialize();
    this.addFilterControls();
  }

  changePageSize() {
    this.localStorageService.store('pageSize', this.categoryLazyRequest.pageSize);
    this.pageChange(1);
  }

  initialize() {
    this.visibilityFormControl.setValue(-1);
    this.activatedRoute.queryParams.subscribe((params) => {
      this.categoryLazyRequest.page = 1;
      this.categoryLazyRequest.pageSize = this.localStorageService.retrieve('pageSize') ?
        this.localStorageService.retrieve('pageSize') : 10;
      this.categoryLazyRequest.status = -1;
      this.categoryLazyRequest.textSearch = '';
      this.categoryLazyRequest.createdAt = '';
      this.categoryLazyRequest.updatedAt = '';
      if (params.parentId) {
        this.categoryLazyRequest.parentId = params.parentId;
      }
      else {
        this.categoryLazyRequest.parentId = -1;
      }
      this.getBreadCrumbCategory();
      this.getLazyCategoryList();
    });
  }

  getBreadCrumbCategory() {
    this.categoryService.getCategory(this.categoryLazyRequest.parentId).subscribe(
      (response) => {
        this.breadCrumbCategory = response;
        this.translateCBC();
      }
    );
  }

  translateCBC() {
    let ctList: Category[] = [];
    // if (this.breadCrumbCategory) {
    //   let c: Category = this.breadCrumbCategory;
    //   while (c.parent !== null) {
    //     const p = c.parent;
    //     p.name = this.getTranslatedName(p);
    //     ctList.push(p);
    //     c = p;
    //   }
    //   ctList = ctList.reverse();
    //   this.breadCrumbCategory.name = this.getTranslatedName(this.breadCrumbCategory);
    //   ctList.push(this.breadCrumbCategory);
    // }
    this.breadcrumbService.sendCategoryBreadCrumbList(ctList);
  }

  addFilterControls() {
    this.filterForm = new FormGroup({
      textSearch: new FormControl(null),
      status: new FormControl(-1),
      createdAt: new FormControl(null),
      updatedAt: new FormControl(null),
    });

    this.triForm =  new FormGroup({
      type: new FormControl(null),
    });

    this.filterForm.get('textSearch').valueChanges.pipe(debounceTime(500), takeUntil(this.unsubscribe)).subscribe(
      (text) => {
        this.categoryLazyRequest.page = 1;
        this.categoryLazyRequest.textSearch = text;
        this.getLazyCategoryList();
      });

    this.filterForm.get('status').valueChanges.subscribe(
      (value) => {
        this.categoryLazyRequest.page = 1;
        this.categoryLazyRequest.status = value;
        this.getLazyCategoryList();
      });

    this.filterForm.get('createdAt').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          this.categoryLazyRequest.createdAt = selectedDate;
        }
        else {
          this.categoryLazyRequest.createdAt = '';
        }
        this.categoryLazyRequest.page = 1;
        this.getLazyCategoryList();
      });

    this.filterForm.get('updatedAt').valueChanges.subscribe(
      (d) => {
        if (d) {
          const selectedDate = d._i.year + '-' + this.getTwo(d._i.month + 1) + '-' + this.getTwo(d._i.date);
          this.categoryLazyRequest.updatedAt = selectedDate;
        }
        else {
          this.categoryLazyRequest.updatedAt = '';
        }
        this.categoryLazyRequest.page = 1;
        this.getLazyCategoryList();
      });

    this.setDateMask();
  }


  sendBreadCrumb(): void {
    this.breadcrumbService.sendBreadcrumb(['CONFIGURATION', 'CATEGORIES_PRODUCT']);
  }

  getLazyCategoryList() {
    this.loading = true;
    this.categoryService.getLazyCategoryList(this.categoryLazyRequest).subscribe(
      (data) => {
        // console.log('categories = ', data);
        this.categoryList = data.data;
        this.totalRecords = data.totalRecords;
      },
      (error) => {
        console.log('category List error = ', error);
      },
      () => {
        this.loading = false;
      }
    );
  }

  pageChange(page: number) {
    this.categoryLazyRequest.page = page;
    this.getLazyCategoryList();
  }

  openSubCategoryList(category: Category) {
    this.router.navigate(['/category-product-conf'], {
      queryParams: {
        parentId: category.id,
      }
    });
  }


  /************ start CRUD functions ****/

  openAddCategoryForm(parentId: number = -1, subCategory: Category = null) {
    const dialogRef = this.matDialog.open(CategoryFormComponent, {
      width: '700px',
      autoFocus: true,
      disableClose: true,
      data: {editMode: false, category: this.breadCrumbCategory, parentId: parentId,
        subCategory: subCategory}
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response && response !== true) {
        if (response.parent !== null) {
          this.categoryLazyRequest.parentId = response.parent.id;
        }
        else  {
          this.categoryLazyRequest.parentId = -1;
        }
        this.categoryLazyRequest.page = 1;
      }
      if (this.categoryLazyRequest.parentId !== -1) {
        this.router.navigate(['/category-product-conf/'], {
          queryParams: {
            parentId: this.categoryLazyRequest.parentId
          }
        })
      }
      else {
        this.router.navigate(['/category-product-conf/']);
        this.getLazyCategoryList();
      }
    });
  }

  openEditCategoryForm(cat: Category) {
    const dialogRef = this.matDialog.open(CategoryFormComponent, {
      width: '700px',
      disableClose: true,
      data: {editMode: true, category: cat}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(
      (response )=> {
        if (response) {
          this.getLazyCategoryList();
        }
      }
    );
  }

  deleteCategory(category: Category) {
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + category.name).then(e => {
      if (e.value) {
        this.categoryService.deleteCategory(category.id).subscribe(
          (response) => {
            if (response.status === 200) {
              this.getLazyCategoryList();
              this.sweetAlertService.success(this.translate.instant('DIALOG.DELETE_SUCCESS'));
            }
          },
          (error) => {
            this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_DELETE') + ' ' + category.name);
          }
        );
      }
    });
  }

  changeCategoryVisibility(category: Category) {
    let msg = '';
    if (category.status) {
      msg = this.translate.instant('DIALOG.YOU_WANT_TO_HIDE');
    }
    else {
      msg = this.translate.instant('DIALOG.YOU_WANT_TO_SHOW');
    }
    this.sweetAlertService.warning(msg + this.localTranslate.transform(category, 'name'))
      .then(res => {
        if (res.value) {
          this.categoryService.changeCategoryVisibility(category.id).subscribe(d => {
            if (d.status === 200) {
              this.getLazyCategoryList();
              this.sweetAlertService.success(this.translate.instant('DIALOG.UPDATE_SUCCESS'));
            }
          });
        }
      });
  }

  /************ end CRUD functions *****************/


  showFullCategoryDescription(modal, category: Category) {
    this.selectedCategory = category;
    this.dialogRef = this.matDialog.open(modal, {
      width: '40%',
      autoFocus: true,
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(d => {
      this.selectedCategory = null;
    });
  }

  showCategoryTranslation(modal, category) {
    this.selectedCategory = category;
    this.dialogRef = this.matDialog.open(modal, {
      width: '40%',
      autoFocus: true,
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(d => {
      this.selectedCategory = null;
    });
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
    this.breadcrumbService.sendCategoryBreadCrumbList([]);
  }

  /********************** order categories section ****************************/

  getSubcategoryList() {
    this.categoryService.getSubcategoryList(this.categoryLazyRequest.parentId).subscribe(
      (data) => {
        this.subCategoryList = data;
        console.log('subcategory List = ', this.subCategoryList);
      }
    );
  }

  showOrderModal(modal) {
    this.triForm.get('type').setValue(null);
    this.getSubcategoryList();
    this.dialogRef = this.matDialog.open(modal, {
      width: '75%',
      height: '95%',
      autoFocus: true,
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(d => {
      this.selectedCategory = null;
    });
  }

  setPriorities() {
    this.categoryService.changePriority(this.subCategoryList).subscribe(
      (r) => {
        console.log('r = ',r);
        if(r.status === 200) {
          this.sweetAlertService.success(this.translate.instant('CATEGORY_FORM.TRI_SAVED_SUCCESS'));
        }
      },
      (e) => {
        console.log('e = ',e);
        this.sweetAlertService.danger(this.translate.instant('CATEGORY_FORM.TRI_SAVED_ERROR'));
      }
    );
  }

  applyTri() {
    const triType = this.triForm.get('type').value;
    console.log('tritype = ', triType);
    if (triType) {
      switch (triType) {
        case 1 : {
          this.subCategoryList = this.subCategoryList.sort((c1, c2) => c1.name.localeCompare(c2.name));
          for(let i=0; i<this.subCategoryList.length;i++) {
            this.subCategoryList[i].priority = (i+1);
          }
          this.subCategoryList = [...this.subCategoryList];
          break;
        }
        case 2 : {
          this.subCategoryList = this.subCategoryList.sort((c1, c2) => c2.name.localeCompare(c1.name));
          for(let i=0; i<this.subCategoryList.length;i++) {
            this.subCategoryList[i].priority = (i+1);
          }
          this.subCategoryList = [...this.subCategoryList];
          break;
        }
      }
    }
  }

  dropTable(event: CdkDragDrop<Category[]>) {
    const prevIndex = this.subCategoryList.findIndex((c) => c.id === event.item.data.id);
    moveItemInArray(this.subCategoryList, prevIndex, event.currentIndex);
    for(let i=0; i<this.subCategoryList.length;i++) {
      this.subCategoryList[i].priority = (i+1);
    }
  }

  /*************************************************/

  async getImage(category: Category) {
    let img = '';
    await this.imageService.getImage(category.id, 'CATEGORY_MENU').subscribe(
      (res) => {
        img = res;
      }
    );
    return img;
  }

  setDateMask() {
    Inputmask('datetime', {
      inputFormat: 'dd/mm/yyyy',
      placeholder: 'dd/mm/yyyy'
    }).mask(this.createAtElem.nativeElement);
  }

  getTwo(nbr): string {
    return (nbr <10)? '0' + nbr : '' + nbr;
  }

}
