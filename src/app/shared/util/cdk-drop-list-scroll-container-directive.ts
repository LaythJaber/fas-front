import { Directive, Input, ElementRef } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[cdkDropListScrollContainer]'
})
export class CdkDropListScrollContainerDirective {
  @Input('cdkDropListScrollContainer') scrollContainer: HTMLElement;
  originalElement: ElementRef<HTMLElement>;

  constructor(cdkDrag: CdkDrag) {

    cdkDrag._dragRef.beforeStarted.subscribe(() => {
      const cdkDropList = cdkDrag.dropContainer;
      if (!this.originalElement) {
        this.originalElement = cdkDropList.element;
      }

      if (this.scrollContainer) {
        const element = this.scrollContainer;
        // @ts-ignore
        cdkDropList._dropListRef.element = element;
        cdkDropList.element = new ElementRef<HTMLElement>(element);
      } else {
        // @ts-ignore
        cdkDropList._dropListRef.element = cdkDropList.element.nativeElement;
        cdkDropList.element = this.originalElement;
      }
    });

  }
}
