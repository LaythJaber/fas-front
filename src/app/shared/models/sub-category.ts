import {Category} from './category';
import {CategoryType} from '../enum/category-type.enum';

export class SubCategory {
  id?: number;
  uuid?: string;
  name?: string;
  description: string;
  type?: CategoryType;
  active?: boolean;
  createdAt?: Date;
  updateAt?: Date;
  category?: Category;
  categoryId?: number;
}
