import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BrandLogo, HomeMultimedia, SecondarySlide} from "../models/multimedia/home-multimedia";
import {LoginMultimedia} from "../models/multimedia/login-multimedia";
import {InscriptionMultimedia} from "../models/multimedia/inscription-multimedia";
import {ThemeColors} from "../models/multimedia/theme-colors";

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {
  private readonly API = environment.api + '/multimedia';

  constructor(private http: HttpClient) {
  }

  updateOtherOptionsHomeMultimedia(request: FormData) {
    return this.http.post<any>(this.API + '/home/other-options', request, {reportProgress: true, observe: 'events'});
  }

  getCurrentGroupHomeMultimedia() {
    return this.http.get<HomeMultimedia>(this.API + '/home');
  }

  addCarouselImage(request) {
    return this.http.post<{ url: string }>(this.API + '/home/carousel', request, {
      reportProgress: true,
      observe: 'events'
    });
  }

  moveCarouselImage(request) {
    return this.http.patch<void>(this.API + '/home/move-carousel-image', request);
  }

  updateCarouselImage(request: { link: any; id: any }) {
    return this.http.patch(this.API + '/home/carousel', request);
  }

  deleteCarouselImage(id) {
    return this.http.delete(this.API + '/home/carousel/' + id);
  }

  deleteDefaultImage(type) {
    return this.http.delete(this.API + '/home/default-images/' + type);
  }

  updateLogos(request: FormData) {
    return this.http.post<{ logoUrl: string, faviconUrl: string }>(
      this.API + '/home/logos',
      request,
      {reportProgress: true, observe: 'events'}
      );
  }

  updateDefaultImages(request: FormData) {
    return this.http.post<{ productDefaultImageUrl: string, categoryDefaultImageUrl: string, couponDefaultImageUrl: string}>(
      this.API + '/home/default-images',
      request,
      {reportProgress: true, observe: 'events'}
    );
  }

  updateIcon(request: FormData) {
    return this.http.post<{ cartIconUrl: string}>(
      this.API + '/home/icons',
      request,
      {reportProgress: true, observe: 'events'}
    );
  }

  updateLoginMultimedia(request) {
    return this.http.post<void>(this.API + '/login', request);
  }

  getCurrentLoginMultimedia() {
    return this.http.get<LoginMultimedia>(this.API + '/login');
  }

  getCurrentInscriptionMultimedia() {
    return this.http.get<InscriptionMultimedia>(this.API + '/inscription');
  }

  updateInscriptionMultimedia(request: any) {
    return this.http.post<void>(this.API + '/inscription', request);
  }

  updateThemeColors(request) {
    return this.http.post<void>(this.API + '/theme-colors', request);
  }

  getCurrentEnterpriseThemeColors() {
    return this.http.get<ThemeColors>(this.API + '/theme-colors');
  }

  addSecondarySlide(req) {
    return this.http.post<SecondarySlide>(this.API + '/home/secondary-slide', req);
  }

  updateSecondarySlide(request: { id: any; categoryId: any }) {
    return this.http.patch<void>(this.API + '/home/secondary-slide', request);
  }

  moveSecondarySlide(request: { slideId: string; oldIndex: any; newIndex: any }) {
    return this.http.patch<void>(this.API + '/home/move-secondary-slide', request);
  }

  deleteSecondarySlide(id) {
    return this.http.delete(this.API + '/home/secondary-slide/' + id);
  }

  toggleSecondarySlide(id) {
    return this.http.patch<void>(this.API + '/home/toggle-secondary-slide/' + id, {});
  }

  addBrandLogo(request) {
    return this.http.post<BrandLogo>(this.API + '/home/brand-logo', request);
  }

  updateBrandLogo(request) {
    return this.http.patch<void>(this.API + '/home/brand-logo', request);
  }

  deleteBrandLogo(id) {
    return this.http.delete<void>(this.API + '/home/brand-logo/' + id);
  }
}
