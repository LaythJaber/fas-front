import {Component, Inject, OnInit} from '@angular/core';
import {Category} from '../../../../../shared/models/category';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ClientMgmService} from '../../../../../shared/services/client-mgm.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ConfigurationsService} from '../../../../../shared/services/configurations.service';
import {SweetAlertService} from '../../../../../shared/services/sweet-alert.service';
import {BreadcrumbService} from '../../../../../core/services/breadcrumb.service';
import {TranslateService} from '@ngx-translate/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoryLazyRequest, CategoryService} from '../../../../../shared/services/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TodoItemFlatNode} from '../../../../../shared/util/todo-item-flat-node';
import {TodoItemNode} from '../../../../../shared/util/todo-item-node';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {CheckListService} from '../../../../../shared/util/check-list-service';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-filter-coupon-category',
  templateUrl: './filter-coupon-category.component.html',
  styleUrls: ['./filter-coupon-category.component.scss'],
  providers: [CheckListService]
})
export class FilterCouponCategoryComponent implements OnInit {

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
  unsubscribe = new Subject();
  filterForm: FormGroup;
  categories: number[];
  siteActiveLanguage;
  categoryLazyRequest: CategoryLazyRequest;
  triForm: FormGroup;
  categorieList: Category[] = [];
  totalRecords: number;
  selectedCategory: Category = null;

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

  treeControl1: FlatTreeControl<TodoItemFlatNode>;
  constructor(public dialogRef: MatDialogRef<FilterCouponCategoryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,   private configurationsService: ConfigurationsService,
              private matDialog: MatDialog,  private _database: CheckListService,
              private sweetAlertService: SweetAlertService,
              private breadcrumbService: BreadcrumbService,
              private translate: TranslateService,
              public modal: NgbModal,
              private categoryService: CategoryService,
            public translationLoaderService: TranslationLoaderService,
              private snackBar: MatSnackBar) {
    this.categories = this.data.categories;
  }

  ngOnInit() {
    this.initCategoryTree();
   }

  /********* nodes functions ************/

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

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
  }

  initCategoryTree() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this._database.dataChange.subscribe(data => {

    this.sortCategory(data);
     data.forEach(c => {
      if ( c.children && c.children.length) {
        this.sortCategory(c.children);
      }
    });

       this.dataSource.data = data;

          for (const node of this.dataSource._flattenedData.getValue()) {
          const index = this.categories.findIndex(pcat => pcat === node.id);
           if ( index >= 0 ) {
            this.treeControl.expandDescendants(node);
            this.checklistSelection.select(node);
           }
        }
      });
    }

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

  sortCategory(cats: TodoItemNode[]) {
    cats.sort((a, b) => a.item.localeCompare(b.item));
  }

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

  filterChanged(filterText: string) {
    this._database.filter(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  onScroll() {
    console.log('paginated!');
   }
}
