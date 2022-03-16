import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MultimediaService} from "../../../../../../shared/services/multimedia.service";
import {CategoryService} from "../../../../../../shared/services/category.service";
import {debounceTime, distinctUntilChanged, map, takeUntil} from "rxjs/operators";
import {FormControl} from "@angular/forms";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";
import * as _ from 'lodash';
import {Subject} from "rxjs";

@Component({
  selector: 'app-secondary-slide-form',
  templateUrl: './secondary-slide-form.component.html',
  styleUrls: ['./secondary-slide-form.component.scss']
})
export class SecondarySlideFormComponent implements OnInit, OnDestroy {
  imageFileResult;
  saveProgress = 0;
  categories: CategoryLight[] = [];
  categoryFormCtrl = new FormControl();
  hasChild = (_: number, node: CategoryLight) => node.children && node.children.length > 0;
  filterCategoriesCtrl = new FormControl();
  private unsub$ = new Subject();
  treeControl = new NestedTreeControl<CategoryLight>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryLight>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private matDialogRef: MatDialogRef<SecondarySlideFormComponent>,
    private multimediaService: MultimediaService,
    private categoryService: CategoryService,
  ) {
  }


  ngOnInit() {
    this.loadCategories();
    if (this.data.slide) {
      this.categoryFormCtrl.setValue(this.data.slide.categoryId);
      this.imageFileResult = this.data.slide.imageUrl;
    } else {
      this.readImageFile();
    }

    this.filterCategoriesCtrl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(250), takeUntil(this.unsub$))
      .subscribe(value => {
      const data = this.filterTree(_.cloneDeep(this.categories), value);
      this.treeControl.dataNodes = data;
      this.dataSource.data = data;
      if (value && value.length > 0) {
        this.treeControl.expandAll();
      } else {
        this.treeControl.collapseAll();
      }
    });
  }

  private readImageFile() {
    const fileReader = new FileReader();
    fileReader.onload = ev => {
      this.imageFileResult = fileReader.result;
    };
    fileReader.readAsDataURL(this.data.file);
  }

  private loadCategories() {
    this.categoryService.getCategoryParentList()
      .pipe(map(u => {
        return u.map(t => this.processTree(t))
      }))
      .subscribe(data => {
        this.dataSource.data = data;
        this.categories = data;
        if (this.data.slide) {
          this.expand(data, this.data.slide.categoryId);
        }
      });
  }

  processTree(category) {
    if (category && category.subCategoryList) {
      return  {
        value: category.id,
        text: category.transInfo.find(x => x.enumLanguage === 'it').name,
        children: category.subCategoryList.map(u => this.processTree(u))
      }
    }
    return category
  }

  filterTree(categories: CategoryLight[], text) {
    if (text && text.length > 0) {
      return _.filter(categories, (item) => {
        if (_.includes(_.toLower(item.text), _.toLower(text))) {
          return true;
        } else if (item.children) {
          item.children = this.filterTree(item.children, text);
          return !_.isEmpty(item.children);
        }
      });
    }
    return this.categories;
  }

  getNodeFromTree(categories, id) {
    return _.find(categories, (item) => {
      if (item.value === id) {
        return true;
      } else if (item.children) {
        return this.getNodeFromTree(item.children, id);
      }
    });
  }

  save() {
    if (!this.categoryFormCtrl.value) {
      return;
    }
    if (this.data.slide) {
      const request = {
        id: this.data.slide.id,
        categoryId: this.categoryFormCtrl.value,
      }
      this.multimediaService.updateSecondarySlide(request).subscribe(() => {
        this.matDialogRef.close(true);
      });
    }
    const formData = new FormData();
    formData.append('secondarySlideImage', this.data.file);
    const req = {
      index: this.data.index,
      categoryId: this.categoryFormCtrl.value
    }
    formData.append('secondarySlideRequest', new Blob([JSON.stringify(req)], {type: 'application/json'}));
    this.multimediaService.addSecondarySlide(formData).subscribe((res) => {
      this.matDialogRef.close(res);
    });
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }
  expand(data: CategoryLight[], categoryId: number): any {
    data.forEach(node => {
      if (node.children && node.children.find(c => c.value === categoryId)) {
        this.treeControl.expand(node);
        this.expand(this.dataSource.data, node.value); // expand parent
      }
      else if (node.children && node.children.find(c => !!c.children)) {
        this.expand(node.children, categoryId);
      }
    });
  }
}
interface CategoryLight {
  value: number;
  text: string;
  children?: CategoryLight[];
  level?: number;
  expandable: boolean;
}
