import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit, OnChanges {
  @Input() data: any[];
  @Input() disabled;
  @Output() dataChange = new EventEmitter<any>();
  @Output() changeDetected = new EventEmitter<boolean>();
  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    this.data = this.data.map(u => {
      u.checked = false;
      u.indeterminate = false;
      u.expand = false;
      u.children = u.children.map(e => {
        e.checked = false;
        return e;
      });
      return u;
    });
  }

  parentChange(i: number, p: any) {
    this.changeDetected.emit(true);
    this.data[i].checked = !this.data[i].checked;
    if (this.data[i].checked) {
      this.data[i].indeterminate = false;
    }
    this.data[i].children.forEach(e => e.checked = this.data[i].checked);
  }

  childChange(i: number, j: number, p: any) {
    this.changeDetected.emit(true);
    this.data[i].children[j].checked = !this.data[i].children[j].checked;
    const child0 = this.data[i].children[0];
    const child1 = this.data[i].children[1];
    this.data[i].checked = child0.checked && child1.checked;
    this.data[i].indeterminate = (child0.checked || child1.checked) && !(child0.checked && child1.checked);
  }

  getChecked(i: number) {
    return this.data[i].children.filter(e => e.checked).map(e => e.name).join(', ');
  }
}
