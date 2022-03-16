import {Component, OnDestroy, OnInit} from '@angular/core';

import { Router } from '@angular/router';
import {NAVIGATION} from "./navigation-data";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  constructor(private router: Router) {
  }

  navigation: any[] = [];
  mySubscription: any;

  ngOnInit() {
    this.navigation = NAVIGATION;
  }

  refresh() {
    window.location.reload();
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  expand() {
    const elem = document.documentElement;
    const methodToBeInvoked = elem.requestFullscreen ||
      elem['mozRequestFullscreen']
      ||
      elem['msRequestFullscreen'];
    if (methodToBeInvoked) {
      methodToBeInvoked.call(elem);
    }
  }

  close(): void {
    if (navigator.userAgent.indexOf('MSIE') > 0) {
      if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
        window.opener = null;
        window.close();
      } else {
        window.open('', '_top');
        window.top.close();
      }
    } else if (navigator.userAgent.indexOf('Firefox') > 0) {
      window.location.href = 'about:blank ';
    } else {
      window.opener = null;
      window.open('', '_self', '');
      window.close();
    }
  }

}
