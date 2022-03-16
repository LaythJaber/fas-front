import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2} from '@angular/core';

import {ThemeConfigService} from 'src/app/core/services/theme-config.service';
import {ComponenRegistryService} from 'src/app/core/services/component-registry.service';
import {BackdropService} from 'src/app/core/services/backdrop.service';
declare let MetisMenu: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class FasSidebarComponent implements OnInit, OnDestroy {

  themeConfig: any;
  _SidebarDrawerMode = false;
  _sidebarAlwaysDrawerMode = false;
  _folded = false;
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
    this._componenRegistryService.register('fas-sidenav', this);

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
    if (this._SidebarDrawerMode) {
      this.toggleDrawerSidebar();
    } else {
      document.body.classList.toggle('mini-sidebar');
    }
  }


  toggleDrawerSidebar() {
    if (this.opened) {
      this.hide();
    } else {
      this.show();
    }
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
    // this._hideSidebar();
  }

  _showSidebar() {
    this.opened = true;

    this.renderer.addClass(this._el.nativeElement, 'shined');
    document.getElementById('sidebar').classList.add('shined');
  }

  _hideSidebar() {
    if (this.opened) {
      this.opened = false;

      this.renderer.removeClass(this._el.nativeElement, 'shined');
      document.getElementById('sidebar').classList.remove('shined');
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
