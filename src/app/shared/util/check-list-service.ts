import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TodoItemNode} from './todo-item-node';
import {CategoryService} from '../services/category.service';
import {Category} from '../models/category';
import {TranslationLoaderService} from '../../core/services/translation-loader.service';

@Injectable()
export class CheckListService {

  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  treeData: any[];

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor(
    private categoryService: CategoryService,
    public translationLoaderService: TranslationLoaderService,
  ) {
    this.initialize();
  }

  initialize() {
    this.categoryService.getCategoryParentList().subscribe(
      (categoryList) => {
        const data = this.buildFileTreeCat(categoryList, 0, 'it');
        this.dataChange.next(data);
        this.translationLoaderService.siteLanguage.subscribe((lang) => {
          const data = this.buildFileTreeCat(categoryList, 0, lang);
          this.treeData = data;
          this.dataChange.next(data);
        });
      }
    );
  }

  buildFileTreeCat(categoryList: Category[], level: number, lang): TodoItemNode[] {
    const nodes: TodoItemNode[] = [];
    for (const cat of categoryList) {
      const node = new TodoItemNode();
      node.id = cat.id;
      node.item = this.getTranslatedName(cat, lang);
      if (cat.subCategoryList !== null && cat.subCategoryList.length !== 0) {
        node.children = this.buildFileTreeCat(cat.subCategoryList, level + 1, lang);
      }
      nodes.push(node);
    }
    return nodes;
  }


  getTranslatedName(category: Category, siteActiveLanguage: String) {
    if (siteActiveLanguage) {
      const ct = category.transInfo.find(ct => {
        if (ct.language.code) {
          return ct.language.code.toUpperCase() === siteActiveLanguage.toUpperCase();
        }
        return false;
      });
      if (ct) {
        return ct.name;
      }
    }
    return category.name;
  }


  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }

  public filter(filterText: string) {
    let filteredTreeData;
    if (filterText) {
      filteredTreeData = this.treeData.filter(d => d.item.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
    } else {
      filteredTreeData = this.treeData;
    }
    this.dataChange.next(filteredTreeData);
  }

}
