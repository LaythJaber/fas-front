import { Injectable } from '@angular/core';
import {Subject, Observable, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private subject = new Subject<any>();
  private categoryBreadCrumbList = new BehaviorSubject<any>([]);
  private pagesList = new BehaviorSubject<any>([]);


    sendBreadcrumb(breadcrumb: string[]) {
        this.subject.next(breadcrumb);
    }

    clearBreadcrumb() {
        this.subject.next();
    }

    getBreadcrumb(): Observable<any> {
        return this.subject.asObservable();
    }

    sendCategoryBreadCrumbList(list) {
      this.categoryBreadCrumbList.next(list);
    }

    getCategoryBreadCrumbList(): Observable<any> {
      return this.categoryBreadCrumbList.asObservable();
    }

  sendPagesList(obj: any) {
    this.pagesList.next(obj);
  }

  getPagesList(): Observable<any> {
    return this.pagesList.asObservable();
  }


}
