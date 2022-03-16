import {Component, OnInit, Renderer2} from '@angular/core';

import {BackdropService} from 'src/app/core/services/backdrop.service';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.css']
})
export class BackdropComponent implements OnInit {

  constructor(
    private _backdropService: BackdropService,
    private renderer: Renderer2,
  ) {
  }

  isOpen: boolean = false;

  ngOnInit() {
    this._backdropService.open.subscribe(() => {
      this.isOpen = true;
      this._show();
    });
    this._backdropService.close.subscribe(() => {
      this.isOpen = false;
      this._hide();
    });
  }

  closeHandler(): void {
    if (this.isOpen) {
      this._backdropService.hide();
    }
  }

  _show() {
    this.renderer.addClass(document.body, 'has-backdrop');
  }

  _hide() {
    this.renderer.removeClass(document.body, 'has-backdrop');
  }

}
