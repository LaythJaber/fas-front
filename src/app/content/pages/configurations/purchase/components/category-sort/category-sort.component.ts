import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Category} from "../../../../../../shared/models/category";
import {CategoryService} from "../../../../../../shared/services/category.service";
import {SweetAlertService} from "../../../../../../shared/services/sweet-alert.service";
import {FormControl, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-category-sort',
  templateUrl: './category-sort.component.html',
  styleUrls: ['./category-sort.component.scss']
})
export class CategorySortComponent implements OnInit {

  catTriForm: FormGroup;
  categoryList: Category[] = [];
  catTriColumns = [
    'DATA_TABLE.ID',
    'DATA_TABLE.NAME',
    'DATA_TABLE.DESCRIPTION',
  ];

  constructor(
    private categoryService: CategoryService,
    private sweetAlertService: SweetAlertService,
    private translate: TranslateService,
  ) {
    this.initForms();
  }

  ngOnInit() {
    this.getCategoryList();
  }

  initForms() {
    this.catTriForm =  new FormGroup({
      type: new FormControl(null),
    });
  }

  getCategoryList() {
    this.categoryService.getSubcategoryList(-1, 2).subscribe(
      (data) => {
        this.categoryList = data;
        console.log('category List = ', this.categoryList);
      }
    );
  }

  setPriorities2() {
    console.log('okkkkkkkkkkk');
    this.categoryService.changePriority2(this.categoryList).subscribe(
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
    const triType = this.catTriForm.get('type').value;
    console.log('tritype = ', triType);
    if (triType) {
      switch (triType) {
        case 1 : {
          this.categoryList = this.categoryList.sort((c1, c2) => c1.name.localeCompare(c2.name));
          for(let i=0; i<this.categoryList.length;i++) {
            this.categoryList[i].priority2 = (i+1);
          }
          this.categoryList = [...this.categoryList];
          break;
        }
        case 2 : {
          this.categoryList = this.categoryList.sort((c1, c2) => c2.name.localeCompare(c1.name));
          for(let i=0; i<this.categoryList.length;i++) {
            this.categoryList[i].priority2 = (i+1);
          }
          this.categoryList = [...this.categoryList];
          break;
        }
      }
    }
  }

  dropTable(event: CdkDragDrop<Category[]>) {
    const prevIndex = this.categoryList.findIndex((c) => c.id === event.item.data.id);
    moveItemInArray(this.categoryList, prevIndex, event.currentIndex);
    for(let i=0; i<this.categoryList.length;i++) {
      this.categoryList[i].priority2 = (i+1);
    }
  }

}
