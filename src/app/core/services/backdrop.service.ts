import { Injectable, Output , EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackdropService {

  constructor() {}

  @Output() open: EventEmitter<boolean> = new EventEmitter();
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  show() {
    this.open.emit();
  }

  hide() {
    this.close.emit();
  }

}
