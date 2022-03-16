import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Language} from "../models/language";
import {Observable, of} from "rxjs";
import {LanguageService} from "./language.service";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LanguageResolverService implements Resolve<Language[]>{

  constructor(private languageService: LanguageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Language[]> | Promise<Language[]> | Language[] {
    return this.languageService.getLanguages().pipe(catchError(() => of(null)));
  }
}
