import { Component, OnInit, Input, HostBinding, ElementRef, Renderer2, } from '@angular/core';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

    @Input() title: string;
    @Input() cardClass: string = '';
    @Input() fullheight: boolean = false;
    @Input() header: boolean = false;
    @Input() actions: any;

    collapsed: boolean = false;
    extended: boolean = false;

    constructor(
        private _el: ElementRef,
        private renderer: Renderer2,
    ) { }

    ngOnInit() {
    }

    collapse(): void
    {
        this.collapsed = !this.collapsed;
    }

    remove(): void
    {
        this.renderer.removeChild(this._el.nativeElement, this._el.nativeElement);
    }

    toggleFullscreen(): void
    {
        if(!this.extended) {
            document.body.classList.add('fullscreen-mode');
            this.renderer.addClass(this._el.nativeElement.children[0], 'card-fullscreen');
            this.extended = true;
        } else {
            document.body.classList.remove('fullscreen-mode');
            this.renderer.removeClass(this._el.nativeElement.children[0], 'card-fullscreen');
            this.extended = false;
        }
    }

}
