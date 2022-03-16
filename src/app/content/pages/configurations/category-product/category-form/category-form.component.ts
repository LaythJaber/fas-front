import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfigurationsService} from "../../../../../shared/services/configurations.service";
import {SweetAlertService} from "../../../../../shared/services/sweet-alert.service";
import {TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoryService} from "../../../../../shared/services/category.service";
import {Category} from "../../../../../shared/models/category";
import {LanguageService} from "../../../../../shared/services/language.service";
import {Language} from "../../../../../shared/models/language";
import {TranslationLoaderService} from "../../../../../core/services/translation-loader.service";
import {CategoryTranslation} from "../../../../../shared/models/category-translation";
import {CropImageComponent} from "../../../../../shared/compoenent/crop-image/crop-image.component";
import {ImageService} from "../../../../../shared/services/image.service";
import {environment} from "../../../../../../environments/environment";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  @ViewChild('nameInput') nameInput: ElementRef;

  imageUrl = environment.publicApi + "/categories/images/"

  categoryList: Category[] = [];
  categoryForm: FormGroup;
  submitted = false;
  addedElement = false;
  addMultipleCheckbox = new FormControl(false);

  languageList: Language[] = [];
  activeLanguage: Language;
  categoryTranslationList: CategoryTranslation[] = [];
  modalRef: any;
  categoryTranslationForm: FormGroup;

  menuImage: string | ArrayBuffer;
  bannerImage: string | ArrayBuffer;

  menuImageFile;
  bannerImageFile;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    private configurationsService: ConfigurationsService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private languageService: LanguageService,
    public translationLoaderService: TranslationLoaderService,
    private matDialog: MatDialog,
    public imageService: ImageService,
  ) { }

  ngOnInit() {
    this.getLanguageList();
    this.getCategoryList();
    this.initForms();
  }

  initForms() {
    this.categoryForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      code: new FormControl(null),
      description: new FormControl(null),
      status: new FormControl(true),
      priority: new FormControl(1, Validators.pattern('[1-9][0-9]*')),
      parentId: new FormControl(null),
      langId: new FormControl(null)
    });
    this.categoryTranslationForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      langId: new FormControl(null),
      langCode: new FormControl(null)
    });
    if (this.data.parentId && this.data.parentId !== -1) {
      this.categoryForm.get('parentId').setValue(Number(this.data.parentId));
      if (this.data.subCategory) {
        this.categoryForm.get('parentId').disable();
      }
    }
    if (this.data.editMode) {
      console.log("category 1111111 = ", this.data.category);
      this.menuImage = this.data.category.menuImage;
      this.bannerImage = this.data.category.bannerImage;
      this.categoryForm.get('code').setValue(this.data.category.code);
      this.categoryForm.get('name').setValue(this.data.category.name);
      this.categoryForm.get('description').setValue(this.data.category.description);
      this.categoryForm.get('status').setValue(this.data.category.status);
      this.categoryForm.get('priority').setValue(this.data.category.priority);
      if (this.data.category.parent !== null) {
        this.categoryForm.get('parentId').setValue(this.data.category.parent.id);
      }
      this.categoryTranslationList = this.data.category.transInfo;
    }
  }

  getCategoryList() {
    if (!this.data.editMode) {
      if (this.data.subCategory) {
        this.categoryList.push(this.data.subCategory);
        return;
      }
      if (this.data.category) {
        this.categoryList.push(this.data.category);
      }
      this.categoryService.getSubcategoryList(this.data.parentId).subscribe(
        (response) => {
          this.categoryList = this.categoryList.concat(response);
          console.log('get categories in popup form subs !!!', this.categoryList)
        }
      )
    }
    else {
      this.categoryService.getCategoryList().subscribe(
        (response) => {
          this.categoryList = response;
          console.log('get categories in popup form parent  !!!!', this.categoryList)
        }
      );
    }
  }

  getLanguageList() {
    this.languageService.getLanguages().subscribe(r => {
      this.languageList = r;
      const siteActiveLanguage = this.translationLoaderService.getActiveLanguage();
      const indexActiveLanguage = this.languageList.findIndex(l => l.code.toUpperCase() === siteActiveLanguage.toUpperCase());
      if (indexActiveLanguage != -1) {
        this.activeLanguage = this.languageList[indexActiveLanguage];
        this.languageList = this.languageList.filter( l => l.code.toUpperCase() !== siteActiveLanguage.toUpperCase());
        if (this.data.editMode) {
          const ct: CategoryTranslation = this.data.category.transInfo.find(ct => ct.language.id === this.activeLanguage.id);
          if (ct) {
            this.categoryForm.get('name').setValue(ct.name);
            this.categoryForm.get('description').setValue(ct.description);
          }
        }
      }
    });
  }

  openCategoryTranslationForm(modal) {
    const langId = this.categoryForm.get('langId').value;
    if (langId) {
      const l = this.languageList.find( l => l.id === langId);
      this.categoryTranslationForm.get('langId').setValue(l.id);
      this.categoryTranslationForm.get('langCode').setValue(l.code);
      const ct = this.categoryTranslationList.find( ct => ct.language.id === langId);
      if (ct) {
        this.categoryTranslationForm.get('name').setValue(ct.name);
        this.categoryTranslationForm.get('description').setValue(ct.description);
      }
      this.modalRef = this.matDialog.open(modal, {
        width: '40%',
        autoFocus: true,
        disableClose: true,
      });
      this.modalRef.afterClosed().subscribe((d) => {
        this.categoryTranslationForm.get('name').setValue(null);
        this.categoryTranslationForm.get('description').setValue(null);
      });
    }
  }

  isNewTranslation() {
    const langId = this.categoryForm.get('langId').value;
    const index = this.categoryTranslationList.findIndex( ct => ct.language.id === langId);
    return index === -1;
  }

  removeCategoryTranslation() {
    const langId = this.categoryForm.get('langId').value;
    this.categoryTranslationList = this.categoryTranslationList.filter( ct => ct.language.id !== langId);
    this.categoryTranslationList = [...this.categoryTranslationList];
    this.categoryForm.get('langId').setValue(null);
  }

  addCategoryTranslation() {
    const categoryTranslation: CategoryTranslation = new CategoryTranslation();
    categoryTranslation.name = this.categoryTranslationForm.get('name').value;
    categoryTranslation.description = this.categoryTranslationForm.get('description').value;
    const lang: Language = new Language();
    lang.id = this.categoryTranslationForm.get('langId').value;
    categoryTranslation.language = lang;
    const index = this.categoryTranslationList.findIndex( ct => ct.language.id === lang.id);
    if (index === -1) {
      this.categoryTranslationList.push(categoryTranslation);
    }
    else {
      this.categoryTranslationList[index] = categoryTranslation;
    }
    this.categoryTranslationForm.get('name').setValue(null);
    this.categoryTranslationForm.get('description').setValue(null);
    this.modalRef.close();
  }

  /*******************************************/

  openChangeImageModal(type: number) {
    const dialogRef = this.dialog.open(CropImageComponent, {width: '60%'});
    dialogRef.afterClosed().subscribe((image) => {
      console.log('image  = ', image);

      if (type === 0) {
        this.menuImageFile = image
      }
      else {
        this.bannerImageFile = image;
      }

      const fileReader = new FileReader();
      fileReader.onload = ev => {
        if (image) {
          if (type === 0) {
            this.menuImage = fileReader.result;
            console.log('menu image = ', this.menuImage);
          }
          else {
            this.bannerImage = fileReader.result;
          }
        }
      };
      fileReader.readAsDataURL(image);
    });
  }

  deleteImage(category: Category, type: 'BANNER' | 'MENU') {
    const msg = type === 'MENU' ? 'menu' : 'banner';
    this.sweetAlertService.warning(this.translate.instant('DIALOG.YOU_WANT_TO_DELETE') + 'l\'immagine del ' + msg + ' del ' +  category.name).then(e => {
      if (e.value) {
        this.categoryService.deleteImage(category.id, type).subscribe(
          (response) => {
            if (response.status === 200) {
              if (type === 'MENU') {
                this.menuImage = null;
                this.data.category.menuImage = null;
              }
              else {
                this.bannerImage = null;
                this.data.category.bannerImage = null;
              }
              this.sweetAlertService.success(this.translate.instant('DIALOG.DELETE_SUCCESS'));
            }
          },
          (error) => {
            this.sweetAlertService.danger(this.translate.instant('DIALOG.CANNOT_DELETE') + ' l\'immagine del ' + msg + ' del ' + category.name);
          }
        );
      }
    });
  }


  /*****************************************/

  save() {
    this.submitted = true;
    if (!this.categoryForm.valid) {
      this.sweetAlertService.notification(this.translate.instant('DIALOG.INSERT_ALL_MANDATORY_INFORMATION')).then(e => {});
      return;
    }
    this.categoryForm.disable();
    this.addedElement = true;
    if (!this.data.editMode) {
      const newCategory = new Category();
      newCategory.name = this.categoryForm.get('name').value;
      newCategory.description = this.categoryForm.get('description').value;
      newCategory.status = this.categoryForm.get('status').value;
      newCategory.priority = this.categoryForm.get('priority').value;
      if (this.categoryForm.get('parentId').value !== null) {
        const parent = new Category();
        parent.id = this.categoryForm.get('parentId').value;
        newCategory.parent = parent;
      }
      else {
        newCategory.parent = null;
      }

      if (this.activeLanguage) {
        const ct = new CategoryTranslation();
        ct.name = newCategory.name;
        ct.description = newCategory.description;
        ct.language = this.activeLanguage;
        this.categoryTranslationList.push(ct);
      }

      newCategory.transInfo = this.categoryTranslationList;

      this.categoryService.addCategory(newCategory).subscribe(
        (response) => {
          if (!this.addMultipleCheckbox.value) {
            this.dialogRef.close(response);
          }
          else {
            this.categoryForm.get('name').setValue(null);
            this.categoryForm.get('description').setValue(null);
            this.categoryForm.get('parentId').setValue(null);
            this.categoryForm.get('status').setValue(true);
          }
          this.snackBar.open(this.translate.instant('DIALOG.ADD_SUCCESS'), 'Ok',
            {duration: 5000, panelClass: 'white-snackbar'});
        },
        (error) => {
          console.log('add category error = ', error);
          this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok',
            {duration: 5000});
        },
        () => {
          this.submitted = false;
          this.categoryForm.enable();
          this.nameInput.nativeElement.focus();
        }
      );
    }
    else {
      const updatedCategory = this.data.category;
      updatedCategory.name = this.categoryForm.get('name').value;
      updatedCategory.description = this.categoryForm.get('description').value;
      updatedCategory.status = this.categoryForm.get('status').value;
      updatedCategory.priority = this.categoryForm.get('priority').value;
      updatedCategory.menuImage = this.menuImage;
      updatedCategory.bannerImage = this.bannerImage;
      if (this.categoryForm.get('parentId').value !== null) {
        const parent = new Category();
        parent.id = this.categoryForm.get('parentId').value;
        updatedCategory.parent = parent;
      }
      else {
        updatedCategory.parent = null;
      }

      if (this.activeLanguage) {
        const ct = new CategoryTranslation();
        ct.name = updatedCategory.name;
        ct.description = updatedCategory.description;
        ct.language = this.activeLanguage;
        this.categoryTranslationList.push(ct);
      }
      updatedCategory.transInfo = this.categoryTranslationList;

      const formData = new FormData();
      formData.append('category', new Blob([JSON.stringify(updatedCategory)], {type: 'application/json'}));
      formData.append('menuImage', this.menuImageFile ? this.menuImageFile : null);
      formData.append('bannerImage', this.bannerImageFile ? this.bannerImageFile : null);

      this.categoryService.updateCategory(updatedCategory.id, formData).subscribe(
        (response) => {
          console.log('update category result = ', response);
        },
        (error) => {
          console.log('update category error = ', error);
          this.categoryForm.enable();
          this.snackBar.open(this.translate.instant('DIALOG.INTERNAL_SERVER_ERROR'), 'Ok', {duration: 5000});
        },
        () => {
          this.dialogRef.close(true);
          this.snackBar.open(this.translate.instant('DIALOG.UPDATE_SUCCESS'), 'Ok', {duration: 5000});
        }
      );
    }

  }


  @HostListener('document:keydown.escape')
  onEscapeBtnClick() {
    this.dialogRef.close(this.addedElement);
  }

}
