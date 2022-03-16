import {Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Renderer2, HostBinding, HostListener} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {ThemeConfigService} from 'src/app/core/services/theme-config.service';
import {ComponenRegistryService} from 'src/app/core/services/component-registry.service';
import {BackdropService} from 'src/app/core/services/backdrop.service';

declare let MetisMenu: any;

@Component({
  selector: 'app-owner-sidebar',
  templateUrl: './owner-sidebar.component.html',
  styleUrls: ['./owner-sidebar.component.css']
})
export class OwnerSidebarComponent implements OnInit, AfterViewInit, OnDestroy {

  themeConfig: any;
  _SidebarDrawerMode: boolean = false;
  _sidebarAlwaysDrawerMode: boolean = false;
  _folded: boolean = false;
  opened: boolean;

  constructor(
    private _el: ElementRef,
    private renderer: Renderer2,
    private _backdropService: BackdropService,
    public _themeConfigService: ThemeConfigService,
    private _componenRegistryService: ComponenRegistryService,
  ) {
  }

  ngOnInit() {
    this._themeConfigService._configSubject
      .subscribe((config) => {
        this.themeConfig = config;
        this._sidebarAlwaysDrawerMode = config.layout.sidebar.always_drawer_mode;
      });

    // Register the component in registry
    this._componenRegistryService.register('ownerSidenav', this);

    this._sidebarAlwaysDrawerMode
      ? this._setDrawerSidebarMode()
      : this.toggleDrawerSidebarMode();

    this._backdropService.close.subscribe(() => {
      if (this._SidebarDrawerMode && this.opened) {
        this._hideSidebar();
      }
    });
  }

  ngOnDestroy() {
    this.hide();
  }


  sidebarToggleHandler() {
    console.log(this._sidebarAlwaysDrawerMode);
    if (this._SidebarDrawerMode) {
      this.toggleDrawerSidebar();
    } else {
      document.body.classList.toggle('mini-sidebar');
    }
  }


  toggleDrawerSidebar() {
    console.log('sdfsdfsdfsdf');
    if (this.opened) {
      this.hide();
    } else {
      this.show();
    }
  }

  ngAfterViewInit() {
    new MetisMenu('#ownerSidenav');
  }

  show() {
    if (!this._SidebarDrawerMode) {
      return;
    }

    this._backdropService.show();
    this._showSidebar();
  }

  hide() {
    if (!this._SidebarDrawerMode) {
      return;
    }

    this._backdropService.hide();
    //this._hideSidebar();
  }

  _showSidebar() {
    this.opened = true;

    this.renderer.addClass(this._el.nativeElement, 'shined');
    document.getElementById('ownerSidebar').classList.add('shined');
  }

  _hideSidebar() {
    if (this.opened) {
      this.opened = false;

      this.renderer.removeClass(this._el.nativeElement, 'shined');
      document.getElementById('ownerSidebar').classList.remove('shined');
    }
  }


  toggleDrawerSidebarMode() {
    if (this._sidebarAlwaysDrawerMode) {
      return;
    }

    if (this._canSetDrawerMode() && !this._SidebarDrawerMode) {
      this._setDrawerSidebarMode();
    } else if (!this._canSetDrawerMode() && this._SidebarDrawerMode) {
      this._removeDrawerSidebarMode();
    }
  }

  _setDrawerSidebarMode() {
    document.body.classList.add('drawer-sidebar');
    this._SidebarDrawerMode = true;
  }

  _removeDrawerSidebarMode() {
    document.body.classList.remove('drawer-sidebar');
    this._SidebarDrawerMode = false;
  }

  _canSetDrawerMode() {
    return (window.innerWidth < 992 && !document.body.classList.contains('mini-sidebar'));
  }

  @HostListener('window:resize')
  onResize() {
    this.toggleDrawerSidebarMode();
  }

}
