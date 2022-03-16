import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LazyRequest} from '../dto/lazy-request';
import {SearchResponse} from '../dto/search-response';
import {Category} from '../models/category';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  CATEGORY_API = environment.api + '/categories';

  constructor(
    private http: HttpClient
  ) {}

  getCategory(categoryId: number) {
    return this.http.get<Category>(this.CATEGORY_API + '/' + categoryId);
  }

  getCategoryList() {
    return this.http.get<Category[]>(`${this.CATEGORY_API}/all`);
  }

  getCategoryParentList() {
    return this.http.get<Category[]>(`${this.CATEGORY_API}/parents`);
  }

  getSubcategoryList(parentId: number, priority: number = 1) {
    return this.http.get<Category[]>(`${this.CATEGORY_API}/subcategory/${parentId}?priority=${priority}`);
  }

  getLazyCategoryList(request: CategoryLazyRequest) {
    return this.http.post<SearchResponse<Category>>(`${this.CATEGORY_API}/filter`, request);
  }


  /************ CRUD Functions ************/

  deleteCategory(id) {
    return this.http.delete(`${this.CATEGORY_API}/${id}`, {observe: 'response'});
  }

  addCategory(category: Category) {
    return this.http.post(`${this.CATEGORY_API}`, category);
  }

  updateCategory(categoryId: number, formData: FormData) {
    return this.http.post<Category>(this.CATEGORY_API + '/' + categoryId, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  changeCategoryVisibility(categoryId: number) {
    return this.http.put(`${this.CATEGORY_API}/visible-state/${categoryId}`, {}, {observe: 'response'});
  }

  changePriority(categoryList: Category[]) {
    return this.http.post(`${this.CATEGORY_API}/priority`, categoryList, {observe: 'response'});
  }

  changePriority2(categoryList: Category[]) {
    return this.http.post(`${this.CATEGORY_API}/priority2`, categoryList, {observe: 'response'});
  }

  deleteImage(id, type) {
    return this.http.delete(`${this.CATEGORY_API}/images/${id}?type=${type}`, {observe: 'response'});
  }

  /***************************************/

  getCategoryParentVisibleList() {
    return this.http.get<Category[]>(`${this.CATEGORY_API}/parents-visible`).pipe(map(
        (response) => {
            return response.map(c => {
                c.name = c.name ? c.name.charAt(0).toUpperCase() + c.name.toLowerCase().slice(1) : null;
                return c;
            });
        }
    ));
}

}

export class CategoryLazyRequest  extends LazyRequest {
  status = -1;
  parentId = 0;
  createdAt = '';
  updatedAt = '';
}
