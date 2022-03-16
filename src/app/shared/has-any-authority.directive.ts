import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { UserService } from './services/user.service';

@Directive({
  selector: '[appHasAnyAuthority]'
})
export class HasAnyAuthorityDirective implements OnInit {

  constructor(private elementRef: ElementRef,
              private userService: UserService,
              private renderer: Renderer2
  ) {}

  @Input() module: string;

  ngOnInit(): void {
    if (!this.authorized(this.module)) {
      this.renderer.addClass(this.elementRef.nativeElement, 'disable-menu');
    }
  }

  private authorized(module) {
    const user = this.userService.getUser();
    return user.authorities.indexOf(module) > -1;
  }

}
